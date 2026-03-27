import { Frame } from "@/components/frame";
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems } from "@/lib/content";
import { LazyPreviewComponent } from "@/lib/lazy-component";
import { descriptionMdxComponents } from "@/lib/mdx-components";
import { inlineLink } from "@/lib/styles";
import type { Item } from "@/lib/types";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";

function Intro() {
  return (
    <div className="entrance pt-8 pb-30">
      <h1 className="font-serif text-heading font-extralight text-ink">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-5 text-body text-dim">
        This site is a collection of my experiments, studies, and writings on software design. Feel
        free to explore! You can also read more{" "}
        <Link href="/about" className={inlineLink}>
          about me
        </Link>
        .
      </p>
      <p className="mt-5 text-body text-dim">
        I&apos;m currently open for design and engineering work. If you&apos;re interested in
        working with me, check out my{" "}
        <Link href="/resume" className={inlineLink}>
          resume
        </Link>{" "}
        and feel free to reach out!
      </p>
    </div>
  );
}

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

export default async function Home() {
  const items = await getAllItems();

  return (
    <>
      <Intro />
      <StaggerEntrance className="space-y-16 pb-16">
        {items.map((item) => (
          <div key={item.slug}>
            <ItemCard item={item} />
          </div>
        ))}
      </StaggerEntrance>
    </>
  );
}
