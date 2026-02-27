import { PreviewCard } from "@/components/preview-card";
import type { Item } from "@/lib/types";

export function WorkFeed({ items }: { items: Item[] }) {
  return (
    <div className="px-5 py-6 lg:py-8 lg:pr-8 lg:pl-0">
      <div className="flex flex-col gap-8 lg:gap-10">
        {items.map((item) => (
          <PreviewCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
