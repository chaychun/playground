"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

const CONTENT_WIDTH = 608; // px — max-w-lg (512px) + xl:px-12 padding (48px × 2)
const STATIC_PAGES = new Set(["about", "now"]);

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/").find(Boolean);
  const isItemPage = !!slug && !STATIC_PAGES.has(slug);

  return (
    <div
      className="panel-transition relative flex h-svh flex-col overflow-hidden bg-paper"
      style={
        {
          "--panel-pct": isItemPage ? "100%" : "40%",
          "--panel-inset": isItemPage ? `${CONTENT_WIDTH}px` : "0px",
          "--panel-split": "calc(var(--panel-pct) - var(--panel-inset))",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
