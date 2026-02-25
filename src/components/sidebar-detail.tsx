import { cn } from "@/lib/cn";
import type { Item } from "@/lib/types";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function formatDate(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

type Props = {
  item: Item;
  prev: Item | undefined;
  next: Item | undefined;
};

export function SidebarDetail({ item, prev, next }: Props) {
  return (
    <>
      <div>
        {/* Back */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm text-link transition-colors hover:text-ink"
        >
          <ArrowLeft
            weight="bold"
            className="size-3 transition-transform group-hover:-translate-x-0.5"
          />
          Work
        </Link>

        {/* Title + description */}
        <h1 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h1>
        <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-dim">{item.description}</p>

        {/* Details section */}
        <div className="mt-10">
          <p className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">Details</p>

          <div className="border-t border-border pt-3">
            <p className="text-2xs text-muted">Created</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{formatDate(item.createdAt)}</p>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <p className="text-2xs text-muted">Type</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border px-2 py-0.5 text-2xs text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: prev/next + external links */}
      <div>
        {(prev ?? next) && (
          <div className="mb-6 flex flex-col gap-1.5">
            {prev && (
              <Link
                href={`/playground/${prev.slug}`}
                className={cn("text-sm text-link transition-colors hover:text-ink")}
              >
                ← {prev.title}
              </Link>
            )}
            {next && (
              <Link
                href={`/playground/${next.slug}`}
                className={cn("text-sm text-link transition-colors hover:text-ink")}
              >
                {next.title} →
              </Link>
            )}
          </div>
        )}

        <div className="h-px w-10 bg-mid" />
        <div className="mt-4 flex gap-4 font-mono text-2xs text-link">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Twitter/X
          </a>
          <a href="mailto:hello@example.com" className="transition-colors hover:text-ink">
            Email
          </a>
        </div>
      </div>
    </>
  );
}
