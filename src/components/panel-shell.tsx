"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const HOME_SPLIT = "40%";
const DEFAULT_PANEL_WIDTH = { minPanelPx: 400, panelPercent: 50 };
const STATIC_PAGES = new Set(["about", "now"]);

export function PanelShell({
  children,
  panelWidthMap,
}: {
  children: ReactNode;
  panelWidthMap: Record<string, { minPanelPx: number; panelPercent: number }>;
}) {
  const pathname = usePathname();
  const slug = pathname.split("/").find(Boolean);

  let panelSplit = HOME_SPLIT;
  if (slug && !STATIC_PAGES.has(slug)) {
    const config = panelWidthMap[slug] ?? DEFAULT_PANEL_WIDTH;
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
