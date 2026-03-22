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

async function ItemCard({ item }: { item: Item }) {
  const slug = item.hasFullPage ? `/${item.slug}` : undefined;
  const externalLink = item.links?.[0]?.href;

  // For the preview, prioritize externalLink if specified, fallback to slug
  const previewHref = externalLink || slug;
  const previewIsExternal = !!externalLink;

  return (
    <>
      {item.hasPreview &&
        (previewHref ? (
          previewIsExternal ? (
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              data-cursor-label={item.links?.[0]?.label}
              className="block"
            >
              <Frame {...item.previewFrame}>
                <LazyPreviewComponent slug={item.slug} />
              </Frame>
            </a>
          ) : (
            <Link href={previewHref} data-cursor="internal" className="block">
              <Frame {...item.previewFrame}>
                <LazyPreviewComponent slug={item.slug} />
              </Frame>
            </Link>
          )
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
        ) : externalLink ? (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-item-title font-light text-ink"
          >
            {item.title}
          </a>
        ) : (
          <span className="font-serif text-item-title font-light text-ink">{item.title}</span>
        )}
        <span className="shrink-0 font-mono text-meta text-muted">
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
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
