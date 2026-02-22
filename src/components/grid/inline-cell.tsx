"use client";

import { CellCaption, aspectClass } from "@/components/grid/cell-parts";
import { cn } from "@/lib/cn";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import type { GridItem } from "@/lib/types";

type InlineItem = Extract<GridItem, { type: "inline" }>;

export function InlineCell({ item }: { item: InlineItem }) {
  return (
    <div>
      <div className={cn("overflow-hidden bg-surface", aspectClass(item.orientation))}>
        <LazyPlaygroundComponent
          slug={item.slug}
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-muted">
              Loading…
            </div>
          }
        />
      </div>
      <CellCaption title={item.title} />
    </div>
  );
}
