import { ExternalCell } from "@/components/grid/external-cell";
import { InlineCell } from "@/components/grid/inline-cell";
import { PreviewCell } from "@/components/grid/preview-cell";
import { computeGridLayout } from "@/lib/grid-layout";
import type { GridItem } from "@/lib/types";

function itemKey(item: GridItem): string {
  return item.type === "external-link" ? item.id : item.slug;
}

function renderCell(item: GridItem) {
  switch (item.type) {
    case "inline":
      return <InlineCell item={item} />;
    case "preview":
      return <PreviewCell item={item} />;
    case "external-link":
      return <ExternalCell item={item} />;
    default:
      item satisfies never;
  }
}

export function PortfolioGrid({ items }: { items: GridItem[] }) {
  const placements = computeGridLayout(items);

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-16 px-6 md:grid-cols-5">
      {placements.map(({ item, colSpan, row }) => (
        <div
          key={itemKey(item)}
          className="grid-cell"
          style={
            {
              "--gc": colSpan,
              "--gr": String(row),
            } as React.CSSProperties
          }
        >
          {renderCell(item)}
        </div>
      ))}
    </div>
  );
}
