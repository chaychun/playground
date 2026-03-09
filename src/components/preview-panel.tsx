"use client";

import { useEffect, useState } from "react";

export function PreviewPanel({ previewSrcMap }: { previewSrcMap: Record<string, string> }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    function handlePointerEnter(e: PointerEvent) {
      const target = (e.target as HTMLElement).closest("[data-preview-slug]");
      if (target) {
        setHoveredSlug(target.getAttribute("data-preview-slug"));
      }
    }

    function handlePointerLeave(e: PointerEvent) {
      const target = (e.target as HTMLElement).closest("[data-preview-slug]");
      if (target) {
        setHoveredSlug(null);
      }
    }

    document.addEventListener("pointerenter", handlePointerEnter, true);
    document.addEventListener("pointerleave", handlePointerLeave, true);
    return () => {
      document.removeEventListener("pointerenter", handlePointerEnter, true);
      document.removeEventListener("pointerleave", handlePointerLeave, true);
    };
  }, []);

  const previewSrc = hoveredSlug ? previewSrcMap[hoveredSlug] : null;

  return (
    <div className="relative flex h-full w-[var(--panel-split)] shrink-0 flex-col overflow-hidden bg-paper">
      {previewSrc &&
        (previewSrc.endsWith(".mp4") || previewSrc.endsWith(".webm") ? (
          <video
            src={previewSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="" className="h-full w-full object-cover" />
        ))}
    </div>
  );
}
