import { CellAction, CellCaption, aspectClass } from "@/components/grid/cell-parts";
import { cn } from "@/lib/cn";
import type { LinkItem } from "@/lib/types";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function ExternalCell({ item }: { item: LinkItem }) {
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
      <div className={cn("bg-surface", aspectClass(item.orientation))} />
      <CellCaption
        title={item.title}
        action={
          <CellAction label="VISIT" icon={<ArrowUpRight weight="bold" className="size-3" />} />
        }
      />
    </a>
  );
}
