"use client";

import { transitionStore } from "@/lib/transition-store";
import type { PreviewConfig } from "@/lib/types";
import { useEffect, useRef } from "react";

export function PreviewPanel({ previewMap }: { previewMap: Record<string, PreviewConfig> }) {
  const mapRef = useRef(previewMap);
  mapRef.current = previewMap;

  useEffect(() => {
    function handlePointerEnter(e: PointerEvent) {
      const el = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
      const target = el?.closest("[data-preview-slug]");
      if (target) {
        const slug = target.getAttribute("data-preview-slug");
        transitionStore.setActive(slug ? (mapRef.current[slug] ?? null) : null);
      }
    }

    function handlePointerLeave(e: PointerEvent) {
      const el = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
      const target = el?.closest("[data-preview-slug]");
      if (target) {
        transitionStore.setActive(null);
      }
    }

    document.addEventListener("pointerenter", handlePointerEnter, true);
    document.addEventListener("pointerleave", handlePointerLeave, true);
    return () => {
      document.removeEventListener("pointerenter", handlePointerEnter, true);
      document.removeEventListener("pointerleave", handlePointerLeave, true);
      transitionStore.setActive(null);
    };
  }, []);

  return <div className="relative h-full w-[var(--panel-split)] shrink-0 bg-paper" />;
}
