import { items } from "@/data/items";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = items.find((i) => i.slug === slug);
  return { title: item ? `${item.title} — Playground` : "Not Found" };
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = items.find((i) => i.slug === slug);
  if (!item) return notFound();

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col px-5 pt-10 pb-6 lg:hidden">
        {item.type === "interactive" && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-surface">
            <LazyPlaygroundComponent
              slug={item.slug}
              fallback={<div className="h-full w-full bg-surface" />}
            />
          </div>
        )}
        <div className="mt-6">
          <span className="font-mono text-[10px] tracking-[0.06em] text-muted uppercase">
            {item.category || DEFAULT_CATEGORY}
          </span>
          <h1 className="mt-1.5 font-serif text-[24px] leading-[30px] font-extralight text-ink">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-3 text-[13px] leading-relaxed text-dim">{item.description}</p>
          )}
          {item.links && (
            <div className="mt-4 flex flex-col gap-2">
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: two-panel */}
      <div className="hidden h-full bg-paper lg:flex">
        {/* Left: interactive component */}
        <div className="relative flex h-full w-[var(--panel-split)] shrink-0 flex-col overflow-hidden bg-paper">
          {item.type === "interactive" && (
            <div className="flex flex-1 items-center justify-center overflow-hidden">
              <div className="h-full w-full">
                <LazyPlaygroundComponent
                  slug={item.slug}
                  fallback={<div className="h-full w-full" />}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: article content */}
        <div className="entrance flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-paper px-8 pt-24 pb-10 xl:px-12">
          <span className="font-mono text-[10px] tracking-[0.06em] text-muted uppercase">
            {item.category || DEFAULT_CATEGORY}
          </span>
          <h1 className="mt-2 font-serif text-[24px] leading-[30px] font-extralight text-ink xl:text-[32px] xl:leading-[38px]">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-dim">{item.description}</p>
          )}
          {item.links && (
            <div className="mt-6 flex flex-col gap-2">
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
