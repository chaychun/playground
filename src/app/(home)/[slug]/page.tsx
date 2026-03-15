import { ComponentFrame } from "@/components/component-frame";
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getItemBySlug } from "@/lib/content";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { DEFAULT_CATEGORY } from "@/lib/types";
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

      {/* Auto-inject interactive component above MDX content */}
      {item.type === "interactive" && (
        <ComponentFrame
          aspectRatio={item.frame?.aspectRatio}
          size={item.frame?.size}
          minHeight={item.frame?.minHeight}
        >
          <LazyPlaygroundComponent
            slug={item.slug}
            fallback={<div className="h-full w-full bg-surface" />}
          />
        </ComponentFrame>
      )}

      <div className="mt-8">{content}</div>
    </StaggerEntrance>
  );
}
