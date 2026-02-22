"use client";

import { cn } from "@/lib/cn";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import type { GridItem } from "@/lib/types";

type InlineItem = Extract<GridItem, { type: "inline" }>;

export function InlineCell({ item }: { item: InlineItem }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div
        className={cn(
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
      <div className="p-3">
        <p className="text-xs font-medium text-muted">{item.title}</p>
      </div>
    </div>
  );
}
