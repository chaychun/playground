import { PreviewPanel } from "@/components/preview-panel";
import { items } from "@/data/items";
import { inlineLink } from "@/lib/styles";
import { DEFAULT_CATEGORY } from "@/lib/types";
import Link from "next/link";

function Intro() {
  return (
    <div>
      <h1 className="font-serif text-[20px] leading-[28px] font-extralight text-ink xl:text-[24px] xl:leading-[32px]">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>.
      </h1>
      <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-dim">
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

export default function Home() {
  const sorted = items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      {/* Mobile: intro + linked list */}
      <div className="entrance flex flex-col px-5 pt-10 pb-6 lg:hidden">
        <Intro />
        <div className="stagger-entrance mt-10">
          {sorted.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="block border-b border-border py-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-[16px] leading-[20px] font-light text-ink">
                  {item.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.04em] text-muted uppercase">
                  {item.category || DEFAULT_CATEGORY}
                </span>
              </div>
              {item.description && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-dim">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: two-panel layout */}
      <div className="hidden h-full bg-paper lg:flex">
        {/* Left: static preview on hover */}
        <PreviewPanel />

        {/* Right: content */}
        <div className="stagger-entrance flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-paper px-8 pt-24 pb-10 xl:px-12">
          <Intro />
          <div className="mt-auto">
            {/* Header row */}
            <div className="flex items-baseline border-b border-border px-3 pb-3">
              <span className="w-[160px] shrink-0 font-mono text-[10px] tracking-[0.04em] text-muted uppercase xl:w-[220px]">
                Name
              </span>
              <span className="hidden min-w-0 flex-1 font-mono text-[10px] tracking-[0.04em] text-muted uppercase xl:block">
                Description
              </span>
              <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.04em] text-muted uppercase 2xl:block">
                Type
              </span>
            </div>

            {/* Data rows */}
            {sorted.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                data-preview-slug={item.slug}
                className="flex w-full items-baseline border-b border-border px-3 py-[14px] text-left hover:bg-ink/[0.06]"
              >
                <span className="w-[160px] shrink-0 font-serif text-[16px] leading-[20px] font-light text-ink xl:w-[220px]">
                  {item.title}
                </span>
                <span className="hidden min-w-0 flex-1 truncate pr-4 font-sans text-xs leading-[16px] font-normal text-muted xl:block">
                  {item.description}
                </span>
                <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.04em] text-muted uppercase 2xl:block">
                  {item.category || DEFAULT_CATEGORY}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
