import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getItemBySlug } from "@/lib/content";
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

  if (!result?.item.hasFullPage) {
    return { title: "Not Found" };
  }

  const { item } = result;
  const title = item.title;

  return {
    title,
    openGraph: {
      title: `${title} — Playground`,
    },
  };
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
      {item.createdAt && (
        <div className="mt-3 font-mono text-meta tracking-[0.04em] text-muted uppercase">
          {(() => {
            const [year, month] = item.createdAt.split("-");
            const date = new Date(Number(year), Number(month) - 1);
            return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          })()}
        </div>
      )}

      <div className="mt-8">{content}</div>
    </StaggerEntrance>
  );
}
