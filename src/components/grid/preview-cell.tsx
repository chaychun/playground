import { CellAction, CellCaption, aspectClass } from "@/components/grid/cell-parts";
import { cn } from "@/lib/cn";
import type { GridItem } from "@/lib/types";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type PreviewItem = Extract<GridItem, { type: "preview" }>;

export function PreviewCell({ item }: { item: PreviewItem }) {
  return (
    <Link href={`/playground/${item.slug}`} className="group block">
      <div className={cn("overflow-hidden bg-surface", aspectClass(item.orientation))}>
        {item.preview.type === "video" ? (
          <video
            src={item.preview.src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.preview.src} alt={item.title} className="h-full w-full object-cover" />
        )}
      </div>
      <CellCaption
        title={item.title}
        action={<CellAction label="VIEW" icon={<CaretRight weight="bold" className="size-3" />} />}
      />
    </Link>
  );
}
