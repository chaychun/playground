"use client";

import { WorkFeed } from "@/components/work-feed";
import { cn } from "@/lib/cn";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { C } from "@/lib/palette";
import type { Item } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

// ─── Preview Panel (left) ────────────────────────────────────────
function PreviewPanel({ item }: { item: Item | null }) {
  return (
    <div
      className="relative flex h-full w-[40%] shrink-0 flex-col overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
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
            background: `linear-gradient(to top, ${C.bg} 0%, ${C.bg}cc 40%, transparent 100%)`,
          }}
        >
          <span
            className="font-dm-mono text-[10px] leading-[12px] tracking-[0.06em] uppercase"
            style={{ color: C.textSecondary }}
          >
            {item.category || "exploration"}
          </span>
          <h2
            className="mt-1.5 font-serif text-[24px] leading-[30px] font-extralight xl:text-[32px] xl:leading-[38px]"
            style={{ color: C.text }}
          >
            {item.title}
          </h2>
        </div>
      )}
    </div>
  );
}

// ─── Work Table (right panel, bottom) ────────────────────────────
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
      <div
        className="flex items-baseline px-3 pb-3"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <span
          className="w-[160px] shrink-0 font-dm-mono text-[10px] tracking-[0.04em] uppercase xl:w-[220px]"
          style={{ color: C.textFaint }}
        >
          Name
        </span>
        <span
          className="hidden min-w-0 flex-1 font-dm-mono text-[10px] tracking-[0.04em] uppercase xl:block"
          style={{ color: C.textFaint }}
        >
          Description
        </span>
        <span
          className="hidden shrink-0 font-dm-mono text-[10px] tracking-[0.04em] uppercase 2xl:block"
          style={{ color: C.textFaint }}
        >
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
              "flex w-full cursor-pointer items-baseline px-3 py-[14px] text-left",
              !isActive && "hover:bg-[#C8C4BC10]",
            )}
            style={{
              backgroundColor: isActive ? C.activeBg : undefined,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              className="w-[160px] shrink-0 font-serif text-[16px] leading-[20px] font-light xl:w-[220px]"
              style={{ color: isActive ? C.activeFg : C.text }}
            >
              {item.title}
            </span>
            <span
              className="hidden min-w-0 flex-1 truncate pr-4 font-body text-[11px] leading-[14px] font-normal xl:block"
              style={{ color: isActive ? C.activeFgSecondary : C.textTertiary }}
            >
              {item.description}
            </span>
            <span
              className="hidden shrink-0 font-dm-mono text-[10px] tracking-[0.04em] uppercase 2xl:block"
              style={{ color: isActive ? C.activeFgTertiary : C.textFaint }}
            >
              {item.category || "exploration"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Homepage ────────────────────────────────────────────────────
export function HomePage({ items }: { items: Item[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedItem = selectedSlug ? (items.find((i) => i.slug === selectedSlug) ?? null) : null;

  return (
    <>
      {/* Mobile: existing card feed */}
      <div className="lg:hidden">
        <WorkFeed items={items} />
      </div>

      {/* Desktop: two-panel layout */}
      <div className="hidden h-full lg:flex" style={{ backgroundColor: C.bg }}>
        {/* Left: Preview */}
        <PreviewPanel item={selectedItem} />

        {/* Right: Content — space-between pushes table to bottom */}
        <div
          className="flex min-w-0 flex-1 flex-col justify-between overflow-x-hidden overflow-y-auto px-8 py-10 xl:px-12"
          style={{ backgroundColor: C.bg }}
        >
          {/* Top: Identity + Intro */}
          <div>
            <div className="flex h-10 items-center">
              <span
                className="font-dm-mono text-[13px] tracking-[0.02em]"
                style={{ color: C.text }}
              >
                chayut c.
              </span>
            </div>

            <div className="mt-10">
              <h1
                className="font-serif text-[20px] leading-[28px] font-extralight xl:text-[24px] xl:leading-[32px]"
                style={{ color: C.text }}
              >
                I&apos;m Chayut, a designer and builder exploring{" "}
                <em className="italic" style={{ color: C.accent }}>
                  interface craft
                </em>
                .
              </h1>
              <p
                className="mt-4 font-body text-[13px] leading-[20px] font-light"
                style={{ color: C.textSecondary }}
              >
                This site is a collection of my experiments, studies, and writings on software
                design. Feel free to explore! You can also read{" "}
                <Link
                  href="/about"
                  className="underline decoration-[rgba(166,205,210,0.4)] underline-offset-[2px] transition-colors hover:decoration-[rgba(166,205,210,0.8)]"
                  style={{ color: C.text }}
                >
                  about me
                </Link>{" "}
                and see what I&apos;m{" "}
                <Link
                  href="/now"
                  className="underline decoration-[rgba(166,205,210,0.4)] underline-offset-[2px] transition-colors hover:decoration-[rgba(166,205,210,0.8)]"
                  style={{ color: C.text }}
                >
                  currently up to
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Bottom: Work table */}
          <WorkTable items={items} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
        </div>
      </div>
    </>
  );
}
