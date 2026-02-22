import type { LinkItem } from "@/lib/types";

export function ExternalCell({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg border border-border bg-surface"
    >
      <div className="aspect-video bg-mid">
        {item.preview.type === "image" ? (
          <img src={item.preview.src} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <video src={item.preview.src} muted loop className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex items-center justify-between p-3">
        <p className="text-xs font-medium text-muted transition-colors group-hover:text-ink">
          {item.title}
        </p>
        <span className="text-xs text-muted">&#x2197;</span>
      </div>
    </a>
  );
}
