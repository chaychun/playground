"use client";

import { DEFAULT_PANEL_WIDTH, panelWidthBySlug } from "@/data/items";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const HOME_PANEL = { panelPercent: 40, minPanelPx: 0 };
const STATIC_PAGES = new Set(["about", "now"]);

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/").find(Boolean);

  const config =
    slug && !STATIC_PAGES.has(slug) ? (panelWidthBySlug[slug] ?? DEFAULT_PANEL_WIDTH) : HOME_PANEL;

  return (
    <div
      className="panel-transition relative flex min-h-svh flex-col bg-paper lg:h-svh lg:overflow-hidden"
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
