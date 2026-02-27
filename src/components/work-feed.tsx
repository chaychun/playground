import { PreviewCard } from "@/components/preview-card";
import type { Item } from "@/lib/types";

export function WorkFeed({ items }: { items: Item[] }) {
  return (
    <div className="py-8 pr-8">
      <div className="flex flex-col gap-10">
        {items.map((item) => (
          <PreviewCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
