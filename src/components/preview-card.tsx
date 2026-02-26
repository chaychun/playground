import type { Item } from "@/lib/types";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function PreviewImage({ item }: { item: Item }) {
  if (item.preview.type === "video") {
    return (
      <video
        src={item.preview.src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (item.preview.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.preview.src} alt={item.title} className="h-full w-full object-cover" />
    );
  }

  // custom preview — placeholder for now
  return null;
}

export function PreviewCard({ item }: { item: Item }) {
  const isExternal = item.content.type === "external";
  const href =
    item.content.type === "external" ? item.content.href : `/playground/${item.slug}`;

  const card = (
    <article className="group">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface transition-shadow duration-300 group-hover:shadow-lg">
        <PreviewImage item={item} />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-ink">{item.title}</h3>
        <div className="flex items-center gap-2">
          {item.tags[0] && <span className="font-mono text-2xs text-muted">{item.tags[0]}</span>}
          {isExternal && (
            <ArrowUpRight
              weight="bold"
              className="size-3 text-muted transition-colors group-hover:text-ink"
            />
          )}
        </div>
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return <Link href={href}>{card}</Link>;
}
