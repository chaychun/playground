"use client";

import { DEFAULT_PANEL_WIDTH, panelWidthBySlug } from "@/data/items";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const HOME_SPLIT = "40%";
const STATIC_PAGES = new Set(["about", "now"]);

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/").find(Boolean);

  let panelSplit = HOME_SPLIT;
  if (slug && !STATIC_PAGES.has(slug)) {
    const config = panelWidthBySlug[slug] ?? DEFAULT_PANEL_WIDTH;
    panelSplit = `max(${config.minPanelPx}px, ${config.panelPercent}%)`;
  }

  return (
    <div
      className="relative flex min-h-svh flex-col bg-paper lg:h-svh lg:overflow-hidden"
      style={{ "--panel-split": panelSplit } as CSSProperties}
    >
      {children}
    </div>
  );
}
