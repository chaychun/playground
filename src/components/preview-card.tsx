import { LazyMount } from "@/lib/lazy-mount";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { LazyPreviewComponent } from "@/lib/lazy-preview";
import type { Item } from "@/lib/types";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

function ItemContent({ item }: { item: Item }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (item.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.src} alt={item.title} className="h-full w-full object-cover" />
    );
  }

  if (item.type === "preview") {
    return <LazyPreviewComponent name={item.name} props={item.props} />;
  }

  // interactive — full component
  return (
    <LazyPlaygroundComponent
      slug={item.slug}
      fallback={<div className="h-full w-full bg-surface" />}
    />
  );
}

export function PreviewCard({ item }: { item: Item }) {
  const needsLazyMount = item.type === "interactive" || item.type === "preview";

  return (
    <article>
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface">
        {needsLazyMount ? (
          <LazyMount className="h-full w-full">
            <ItemContent item={item} />
          </LazyMount>
        ) : (
          <ItemContent item={item} />
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-medium text-ink">{item.title}</h3>
          {item.links &&
            item.links.length > 0 &&
            item.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 rounded-full bg-surface px-2 py-0.5 text-2xs font-medium text-dim transition-colors hover:bg-border hover:text-ink"
              >
                {link.label}
                <ArrowUpRight weight="bold" className="size-2.5" />
              </a>
            ))}
          <time className="ml-auto font-mono text-2xs text-muted">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
        {item.description && (
          <p className="mt-2 max-w-xl text-sm text-dim">{item.description}</p>
        )}
      </div>
    </article>
  );
}
