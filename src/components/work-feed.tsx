import { PreviewCard } from "@/components/preview-card";
import type { Item } from "@/lib/types";

export function WorkFeed({ items }: { items: Item[] }) {
  return (
    <div className="px-10 py-10">
      <p className="mb-8 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
        Selected Work
      </p>
      <div className="flex flex-col gap-10">
        {items.map((item) => (
          <PreviewCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
