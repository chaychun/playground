import { Frame } from "@/components/frame";
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems } from "@/lib/content";
import { LazyPreviewComponent } from "@/lib/lazy-component";
import { descriptionMdxComponents } from "@/lib/mdx-components";
import type { Item } from "@/lib/types";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Playground",
  description: "A collection of interactive experiments, studies, and component explorations.",
};

async function ItemDescription({ markdown }: { markdown: string }) {
  const { content } = await compileMDX({ source: markdown, components: descriptionMdxComponents });
  return <div className="mt-1.5 text-body-sm text-dim">{content}</div>;
}

function ItemCard({ item }: { item: Item }) {
  return (
    <>
      {item.hasPreview && (
        <Frame {...item.previewFrame}>
          <LazyPreviewComponent slug={item.slug} />
        </Frame>
      )}
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-serif text-item-title font-light text-ink">{item.title}</span>
        <span className="shrink-0 font-mono text-meta text-muted">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      {item.body && <ItemDescription markdown={item.body} />}
    </>
  );
}

export default async function PlaygroundPage() {
  const items = await getAllItems();

  return (
    <StaggerEntrance className="space-y-16 pt-8 pb-16">
      {items.map((item) => (
        <div key={item.slug}>
          <ItemCard item={item} />
        </div>
      ))}
    </StaggerEntrance>
  );
}
