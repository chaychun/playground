"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const HOME_PANEL = { panelPercent: 40, minPanelPx: 0 };
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

  const config =
    slug && !STATIC_PAGES.has(slug) ? (panelWidthMap[slug] ?? DEFAULT_PANEL_WIDTH) : HOME_PANEL;

  return (
    <div
      className="panel-transition relative flex h-svh flex-col overflow-hidden bg-paper"
      style={
        {
          "--panel-percent": `${config.panelPercent}%`,
          "--panel-min-px": `${config.minPanelPx}px`,
          "--panel-split": `max(var(--panel-min-px), var(--panel-percent))`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
