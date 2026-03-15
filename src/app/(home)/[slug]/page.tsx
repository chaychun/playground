import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getItemBySlug } from "@/lib/content";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const items = await getAllItems();
  return items.filter((i) => i.hasFullPage).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getItemBySlug(slug);
  return { title: result?.item.hasFullPage ? `${result.item.title} — Playground` : "Not Found" };
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getItemBySlug(slug);
  if (!result) return notFound();

  const { item, content } = result;
  if (!item.hasFullPage) return notFound();

  return (
    <StaggerEntrance className="pt-8 pb-16">
      <h1 className="font-serif text-heading font-extralight text-ink">{item.title}</h1>
      <div className="mt-3 font-mono text-meta tracking-[0.04em] text-muted uppercase">
        {item.category || DEFAULT_CATEGORY}
        {item.createdAt && (
          <>
            <span className="mx-2 text-border">·</span>
            {new Date(item.createdAt).getFullYear()}
          </>
        )}
      </div>

      <div className="mt-8">{content}</div>
    </StaggerEntrance>
  );
}
