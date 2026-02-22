import { CellAction, CellCaption, aspectClass } from "@/components/grid/cell-parts";
import { cn } from "@/lib/cn";
import type { GridItem } from "@/lib/types";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type PreviewItem = Extract<GridItem, { type: "preview" }>;

export function PreviewCell({ item }: { item: PreviewItem }) {
  return (
    <Link href={`/playground/${item.slug}`} className="group block">
      <div className={cn("bg-surface", aspectClass(item.orientation))} />
      <CellCaption
        title={item.title}
        action={<CellAction label="VIEW" icon={<CaretRight weight="bold" className="size-3" />} />}
      />
    </Link>
  );
}
