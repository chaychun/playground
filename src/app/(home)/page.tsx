import { Frame } from "@/components/frame";
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems } from "@/lib/content";
import { LazyPreviewComponent } from "@/lib/lazy-component";
import { inlineLink } from "@/lib/styles";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { Item } from "@/lib/types";
import Link from "next/link";

function Intro() {
  return (
    <div className="pt-8 pb-30">
      <h1 className="font-serif text-heading font-extralight text-ink">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>
        <span className="text-accent">.</span>
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
        <span className="shrink-0 font-mono text-meta tracking-[0.04em] text-muted uppercase">
          {item.category || DEFAULT_CATEGORY}
        </span>
      </div>
      {item.description && <p className="mt-1.5 text-body-sm text-dim">{item.description}</p>}
    </>
  );
}

export default async function Home() {
  const items = await getAllItems();

  return (
    <>
      <Intro />
      <StaggerEntrance className="space-y-16 pb-16">
        {items.map((item) =>
          item.hasFullPage ? (
            <Link key={item.slug} href={`/${item.slug}`} className="block">
              <ItemCard item={item} />
            </Link>
          ) : (
            <div key={item.slug}>
              <ItemCard item={item} />
            </div>
          ),
        )}
      </StaggerEntrance>
    </>
  );
}
