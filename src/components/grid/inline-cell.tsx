"use client";

import { cn } from "@/lib/cn";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import type { GridItem } from "@/lib/types";

type InlineItem = Extract<GridItem, { type: "inline" }>;

export function InlineCell({ item }: { item: InlineItem }) {
  return (
    <div>
      <div
        className={cn(
          "overflow-hidden bg-surface",
          item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-video",
        )}
      >
        <LazyPlaygroundComponent
          slug={item.slug}
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Loading…
            </div>
          }
        />
      </div>
      <div className="pt-1.5">
        <p className="text-xs font-medium tracking-wide text-ink">{item.title}</p>
      </div>
    </div>
  );
}
