import { LazyPreviewComponent } from "@/lib/lazy-preview";
import type { Item } from "@/lib/types";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function PreviewContent({ item }: { item: Item }) {
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

  return (
    <LazyPreviewComponent
      name={item.preview.component ?? "placeholder"}
      props={
        item.preview.component ? item.preview.props : { name: item.title, ...item.preview.props }
      }
    />
  );
}

export function PreviewCard({ item }: { item: Item }) {
  const href = item.content.type === "external" ? item.content.href : `/playground/${item.slug}`;
  const isExternal = item.content.type === "external";

  const card = (
    <article className="group">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface transition-shadow duration-300 group-hover:shadow-lg">
        <PreviewContent item={item} />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-ink">{item.title}</h3>
        <div className="flex items-center gap-2">
          <time className="font-mono text-2xs text-muted">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </time>
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
