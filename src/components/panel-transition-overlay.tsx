"use client";

import { transitionStore } from "@/lib/transition-store";
import type { PreviewConfig, PreviewSrc } from "@/lib/types";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Panel Transition (Home → Item)
 *
 * The overlay serves double duty:
 *   Hover mode  — shows the hovered preview (same DOM element)
 *   Transition  — freezes the preview, panel resizes, then clips away
 *
 * Because the media element is never unmounted between modes,
 * the video keeps playing seamlessly (like Astro transition:persist).
 *
 *    0ms   overlay captures snapshot + media size
 *          panel width CSS transition starts (700ms expo)
 *  800ms   panel width settled → clip transition begins
 *          inset(0) → inset(100% 0 0 0) over 600ms
 * 1400ms   clip complete, overlay unmounts
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  clipDelay: 800, // ms — wait for panel width to settle (700ms + buffer)
  clipDuration: 600, // ms — clip reveal duration
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function PanelTransitionOverlay() {
  const active = useSyncExternalStore(
    transitionStore.subscribe,
    transitionStore.getActive,
    () => null,
  );
  const [snapshot, setSnapshot] = useState<PreviewConfig | null>(null);
  const [clipping, setClipping] = useState(false);
  const [fixedSize, setFixedSize] = useState<{ width: number; height: number } | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const clipTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Capture transition on click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("[data-preview-slug]");
      if (target) {
        const preview = transitionStore.getActive();
        if (preview) {
          // Only fix media size when there's padding (contain mode).
          // When padding is 0 (cover/full-bleed), asset stretches with panel.
          const hasPadding = (preview.padding ?? 0) > 0;
          const rect = hasPadding ? innerRef.current?.getBoundingClientRect() : null;
          const size = rect ? { width: rect.width, height: rect.height } : null;

          flushSync(() => {
            setSnapshot(preview);
            setFixedSize(size);
          });

          // Schedule clip after panel width settles
          clipTimerRef.current = setTimeout(() => setClipping(true), TIMING.clipDelay);
        }
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (clipTimerRef.current) clearTimeout(clipTimerRef.current);
    };
  }, []);

  function handleTransitionEnd() {
    if (clipping) {
      setSnapshot(null);
      setClipping(false);
      setFixedSize(null);
    }
  }

  // During transition: show frozen snapshot. During hover: show active preview.
  const isTransitioning = snapshot !== null;
  const preview = snapshot ?? active;
  if (!preview) return null;

  return (
    <PreviewMedia
      preview={preview}
      isTransitioning={isTransitioning}
      fixedSize={fixedSize}
      clipping={clipping}
      innerRef={innerRef}
      onTransitionEnd={handleTransitionEnd}
    />
  );
}

function PreviewMedia({
  preview,
  isTransitioning,
  fixedSize,
  clipping,
  innerRef,
  onTransitionEnd,
}: {
  preview: PreviewConfig;
  isTransitioning: boolean;
  fixedSize: { width: number; height: number } | null;
  clipping: boolean;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onTransitionEnd: () => void;
}) {
  const srcs = Array.isArray(preview.src) ? preview.src : [preview.src];
  const [cycleIndex, setCycleIndex] = useState(0);

  // Reset cycle when switching to a different preview
  useEffect(() => {
    setCycleIndex(0);
  }, [preview]);

  useEffect(() => {
    if (srcs.length <= 1 || !preview.interval) return;
    const ms = preview.interval * 1000;
    const id = setInterval(() => setCycleIndex((i) => (i + 1) % srcs.length), ms);
    return () => clearInterval(id);
  }, [srcs.length, preview.interval]);

  const currentSrc: PreviewSrc = srcs[cycleIndex % srcs.length];
  const isVideo =
    typeof currentSrc === "string" && (currentSrc.endsWith(".mp4") || currentSrc.endsWith(".webm"));
  const fit = preview.fit ?? "cover";
  const p = preview.padding ?? 0;

  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[var(--panel-split)] overflow-hidden lg:block"
      style={{
        background: preview.bg ?? "var(--color-paper)",
        clipPath: clipping ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
        transition: clipping ? `clip-path ${TIMING.clipDuration}ms ${EASE}` : "none",
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === "clip-path") onTransitionEnd();
      }}
    >
      <div
        ref={innerRef}
        className="flex items-center justify-center"
        style={
          isTransitioning && fixedSize
            ? {
                position: "absolute",
                top: "50%",
                left: "50%",
                width: fixedSize.width,
                height: fixedSize.height,
                transform: "translate(-50%, -50%)",
              }
            : {
                position: "absolute",
                inset: `${p}% ${p}%`,
              }
        }
      >
        {isVideo ? (
          <video
            src={currentSrc as string}
            autoPlay
            loop
            muted
            playsInline
            className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <Image
            src={currentSrc}
            alt=""
            fill
            className={fit === "contain" ? "object-contain" : "object-cover"}
            style={preview.position ? { objectPosition: preview.position } : undefined}
          />
        )}
      </div>
    </div>
  );
}
