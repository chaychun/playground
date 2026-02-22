import { cn } from "@/lib/cn";
import type { LinkItem } from "@/lib/types";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function ExternalCell({ item }: { item: LinkItem }) {
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div
        className={cn(
          "bg-surface",
          item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-video",
        )}
      />
      <div className="flex items-baseline justify-between pt-1.5">
        <p className="text-xs font-medium tracking-wide text-ink">{item.title}</p>
        <span className="flex items-center gap-1 font-mono text-2xs tracking-wide text-muted uppercase transition-colors group-hover:text-ink">
          VISIT
          <ArrowUpRight weight="bold" className="size-3" />
        </span>
      </div>
    </a>
  );
}
