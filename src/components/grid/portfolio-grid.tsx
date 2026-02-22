import { ExternalCell } from "@/components/grid/external-cell";
import { InlineCell } from "@/components/grid/inline-cell";
import { PreviewCell } from "@/components/grid/preview-cell";
import type { GridItem } from "@/lib/types";

export function PortfolioGrid({ items }: { items: GridItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        switch (item.type) {
          case "inline":
            return <InlineCell key={item.slug} item={item} />;
          case "preview":
            return <PreviewCell key={item.slug} item={item} />;
          case "external-link":
            return <ExternalCell key={item.id} item={item} />;
        }
      })}
    </div>
  );
}
