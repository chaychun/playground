import { cn } from "@/lib/cn";
import type { GridItem } from "@/lib/types";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type PreviewItem = Extract<GridItem, { type: "preview" }>;

export function PreviewCell({ item }: { item: PreviewItem }) {
  return (
    <Link href={`/playground/${item.slug}`} className="group block">
      <div
        className={cn(
          "bg-surface",
          item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-video",
        )}
      />
      <div className="flex items-baseline justify-between pt-1.5">
        <p className="text-xs font-medium tracking-wide text-ink">{item.title}</p>
        <span className="flex items-center gap-1 font-mono text-2xs tracking-wide text-muted uppercase transition-colors group-hover:text-ink">
          VIEW
          <CaretRight weight="bold" className="size-3" />
        </span>
      </div>
    </Link>
  );
}
