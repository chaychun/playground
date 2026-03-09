"use client";

import { transitionStore } from "@/lib/transition-store";
import type { PreviewConfig } from "@/lib/types";
import { useEffect, useRef } from "react";

export function PreviewPanel({ previewMap }: { previewMap: Record<string, PreviewConfig> }) {
  const mapRef = useRef(previewMap);
  mapRef.current = previewMap;

  useEffect(() => {
    function handlePointerOver(e: PointerEvent) {
      const el = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
      const target = el?.closest("[data-preview-slug]");
      const slug = target?.getAttribute("data-preview-slug");
      transitionStore.setActive(slug ? (mapRef.current[slug] ?? null) : null);
    }

    function handlePointerOut(e: PointerEvent) {
      const el = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
      const related =
        e.relatedTarget instanceof Element
          ? e.relatedTarget
          : (e.relatedTarget as Node | null)?.parentElement;
      const from = el?.closest("[data-preview-slug]");
      const to = related?.closest("[data-preview-slug]");
      // Only clear when leaving a row without entering another
      if (from && !to) transitionStore.setActive(null);
    }

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      transitionStore.setActive(null);
    };
  }, []);

  return <div className="relative h-full w-[var(--panel-split)] shrink-0 bg-paper" />;
}
