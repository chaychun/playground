import { cn } from "@/lib/cn";
import { getAllItems, getItemBySlug } from "@/lib/content";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const items = await getAllItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getItemBySlug(slug);
  return { title: result ? `${result.item.title} — Playground` : "Not Found" };
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getItemBySlug(slug);
  if (!result) return notFound();

  const { item, content } = result;
  const hasPanel = item.type === "interactive";

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col px-5 pt-10 pb-6 lg:hidden">
        {hasPanel && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-surface">
            <LazyPlaygroundComponent
              slug={item.slug}
              fallback={<div className="h-full w-full bg-surface" />}
            />
          </div>
        )}
        <div className={cn("space-y-4 text-[13px] leading-relaxed text-dim", hasPanel && "mt-6")}>
          {content}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden h-full bg-paper lg:flex">
        {hasPanel && (
          <div className="relative flex h-full w-[var(--panel-split)] shrink-0 flex-col overflow-hidden bg-paper">
            <div className="flex flex-1 items-center justify-center overflow-hidden">
              <div className="h-full w-full">
                <LazyPlaygroundComponent
                  slug={item.slug}
                  fallback={<div className="h-full w-full" />}
                />
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "entrance flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-paper px-8 pt-24 pb-10 xl:px-12",
            !hasPanel && "lg:ml-[var(--panel-split)]",
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
