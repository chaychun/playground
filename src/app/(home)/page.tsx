import { Frame } from "@/components/frame";
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems } from "@/lib/content";
import { LazyPreviewComponent } from "@/lib/lazy-component";
import { descriptionMdxComponents } from "@/lib/mdx-components";
import { inlineLink } from "@/lib/styles";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { Item } from "@/lib/types";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";

function Intro() {
  return (
    <div className="pt-8 pb-30">
      <h1 className="font-serif text-heading font-extralight text-ink">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>.
      </h1>
      <p className="mt-5 text-body text-dim">
        This site is a collection of my experiments, studies, and writings on software design. Feel
        free to explore! You can also read{" "}
        <Link href="/about" className={inlineLink}>
          about me
        </Link>{" "}
        and see what I&apos;m{" "}
        <Link href="/now" className={inlineLink}>
          currently up to
        </Link>
        .
      </p>
    </div>
  );
}

async function ItemDescription({ markdown }: { markdown: string }) {
  const { content } = await compileMDX({ source: markdown, components: descriptionMdxComponents });
  return <div className="mt-1.5 text-body-sm text-dim">{content}</div>;
}

async function ItemCard({ item }: { item: Item }) {
  const slug = item.hasFullPage ? `/${item.slug}` : undefined;
  return (
    <>
      {item.hasPreview &&
        (slug ? (
          <Link href={slug} className="block">
            <Frame {...item.previewFrame}>
              <LazyPreviewComponent slug={item.slug} />
            </Frame>
          </Link>
        ) : (
          <Frame {...item.previewFrame}>
            <LazyPreviewComponent slug={item.slug} />
          </Frame>
        ))}
      <div className="mt-3 flex items-baseline justify-between gap-3">
        {slug ? (
          <Link href={slug} className="font-serif text-item-title font-light text-ink">
            {item.title}
          </Link>
        ) : (
          <span className="font-serif text-item-title font-light text-ink">{item.title}</span>
        )}
        <span className="shrink-0 font-mono text-meta tracking-[0.04em] text-muted uppercase">
          {item.category || DEFAULT_CATEGORY}
        </span>
      </div>
      {item.description && <ItemDescription markdown={item.description} />}
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
