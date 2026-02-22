import { cn } from "@/lib/cn";
import type { GridItem } from "@/lib/types";
import Link from "next/link";

type PreviewItem = Extract<GridItem, { type: "preview" }>;

export function PreviewCell({ item }: { item: PreviewItem }) {
  return (
    <Link
      href={`/playground/${item.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div
        className={cn(
          "bg-mid",
          item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-video",
        )}
      >
        {item.preview.type === "image" ? (
          <img src={item.preview.src} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <video src={item.preview.src} muted loop className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-muted transition-colors group-hover:text-ink">
          {item.title}
        </p>
      </div>
    </Link>
  );
}
