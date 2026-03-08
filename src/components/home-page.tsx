"use client";

import { cn } from "@/lib/cn";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { DEFAULT_CATEGORY, type Item } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

// ─── Intro ───────────────────────────────────────────────────────
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
        <Link
          href="/about"
          className="text-ink underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        >
          about me
        </Link>{" "}
        and see what I&apos;m{" "}
        <Link
          href="/now"
          className="text-ink underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        >
          currently up to
        </Link>
        .
      </p>
    </div>
  );
}

// ─── Preview Panel (left) ────────────────────────────────────────
function PreviewPanel({ item }: { item: Item | null }) {
  return (
    <div className="relative flex h-full w-[var(--panel-split)] shrink-0 flex-col overflow-hidden bg-paper">
      {/* Component preview */}
      {item && item.type === "interactive" && (
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <div className="h-full w-full">
            <LazyPlaygroundComponent
              slug={item.slug}
              fallback={<div className="h-full w-full" />}
            />
          </div>
        </div>
      )}

      {/* Bottom info overlay */}
      {item && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 p-6 xl:p-10"
          style={{
            background: `linear-gradient(to top, var(--paper) 0%, color-mix(in srgb, var(--paper) 80%, transparent) 40%, transparent 100%)`,
          }}
        >
          <span className="font-mono text-[10px] leading-[12px] tracking-[0.06em] text-muted uppercase">
            {item.category || DEFAULT_CATEGORY}
          </span>
          <h2 className="mt-1.5 font-serif text-[24px] leading-[30px] font-extralight text-ink xl:text-[32px] xl:leading-[38px]">
            {item.title}
          </h2>
        </div>
      )}
    </div>
  );
}

// ─── Work Table (right panel, desktop) ───────────────────────────
function WorkTable({
  items,
  selectedSlug,
  onSelect,
}: {
  items: Item[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  return (
    <div>
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
      {items.map((item) => {
        const isActive = item.slug === selectedSlug;

        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(isActive ? null : item.slug)}
            className={cn(
              "flex w-full cursor-pointer items-baseline border-b border-border px-3 py-[14px] text-left",
              isActive ? "bg-ink" : "hover:bg-ink/[0.06]",
            )}
          >
            <span
              className={cn(
                "w-[160px] shrink-0 font-serif text-[16px] leading-[20px] font-light xl:w-[220px]",
                isActive ? "text-ink-inv" : "text-ink",
              )}
            >
              {item.title}
            </span>
            <span
              className={cn(
                "hidden min-w-0 flex-1 truncate pr-4 font-sans text-xs leading-[16px] font-normal xl:block",
                isActive ? "text-ink-inv/70" : "text-muted",
              )}
            >
              {item.description}
            </span>
            <span
              className={cn(
                "hidden shrink-0 font-mono text-[10px] tracking-[0.04em] uppercase 2xl:block",
                isActive ? "text-ink-inv/50" : "text-muted",
              )}
            >
              {item.category || DEFAULT_CATEGORY}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Mobile Item List ────────────────────────────────────────────
function MobileList({ items }: { items: Item[] }) {
  return (
    <div className="stagger-entrance">
      {items.map((item) => (
        <div key={item.slug} className="border-b border-border py-4">
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
        </div>
      ))}
    </div>
  );
}

// ─── Homepage ────────────────────────────────────────────────────
export function HomePage({ items }: { items: Item[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedItem = selectedSlug ? (items.find((i) => i.slug === selectedSlug) ?? null) : null;

  return (
    <>
      {/* Mobile: intro + list */}
      <div className="entrance flex flex-col px-5 pt-10 pb-6 lg:hidden">
        <Intro />
        <div className="mt-10">
          <MobileList items={items} />
        </div>
      </div>

      {/* Desktop: two-panel layout */}
      <div className="hidden h-full bg-paper lg:flex">
        {/* Left: Preview */}
        <PreviewPanel item={selectedItem} />

        {/* Right: Content */}
        <div className="stagger-entrance flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-paper px-8 pt-24 pb-10 xl:px-12">
          <Intro />
          <div className="mt-auto">
            <WorkTable items={items} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
          </div>
        </div>
      </div>
    </>
  );
}
