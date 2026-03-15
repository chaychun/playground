# Single-Column Layout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split-panel layout with a centered single-column design featuring editorial typography, inline interactive components, and a unified responsive layout.

**Architecture:** Delete split-panel machinery (PanelShell, PreviewPanel, PanelTransitionOverlay, transition-store). Replace with a simple `max-w-[680px] mx-auto` column wrapper. Interactive components move from a side panel into the article flow via a new `ComponentFrame` MDX component.

**Tech Stack:** Next.js 15, React, Tailwind CSS v4, MDX (next-mdx-remote), Framer Motion

**Spec:** `docs/superpowers/specs/2026-03-15-single-column-layout-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/component-frame.tsx` | Invisible sizing wrapper for inline interactive elements in MDX |
| `src/components/caption.tsx` | Styled mono caption paragraph for MDX |

### Modified Files
| File | Change |
|------|--------|
| `src/app/globals.css` | Remove panel CSS properties, update typography scale |
| `src/lib/mdx-components.tsx` | Update typography sizes, remove `max-w-lg`, register `ComponentFrame` and `Caption` |
| `src/app/(home)/layout.tsx` | Strip to centered column wrapper |
| `src/app/(home)/page.tsx` | Single vertical feed with inline preview images |
| `src/app/(home)/[slug]/page.tsx` | Article flow, auto-inject ComponentFrame for interactive items |
| `src/app/(home)/about/page.tsx` | Remove `lg:ml-[var(--panel-split)]` positioning |
| `src/app/(home)/now/page.tsx` | Remove `lg:ml-[var(--panel-split)]` positioning |

### Deleted Files
| File | Reason |
|------|--------|
| `src/components/panel-shell.tsx` | Split-panel controller, no longer needed |
| `src/components/preview-panel.tsx` | Hover preview panel, replaced by inline previews |
| `src/components/panel-transition-overlay.tsx` | Clip-path page transition, removed |
| `src/lib/transition-store.ts` | Pub-sub for preview state, no consumers |

### Kept (Unchanged)
| File | Note |
|------|------|
| `src/components/scroll-edge-blur.tsx` | Kept for future reuse, import removed from layout |
| `src/app/layout.tsx` | Root layout unchanged (fonts, metadata) |
| `src/lib/lazy-component.tsx` | Reused inside ComponentFrame |
| `src/lib/content.ts` | Content loading unchanged |
| `src/lib/types.ts` | Types unchanged |
| `src/components/stagger-entrance.tsx` | Still used for entrance animations |
| `src/components/breadcrumb-nav.tsx` | Unchanged — contains no panel-related code; the panel offset was in the layout wrapper div, not this component |

**Note on `--text-*` CSS properties:** The spec mentions updating these in `globals.css`, but the plan uses explicit pixel sizes in components instead. The existing `--text-*` properties are left as-is since they're referenced by playground item components (e.g. graeco-latin-squares, info-modal) and changing them could break those.

---

## Chunk 1: Foundation (New Components + CSS + MDX)

### Task 1: Create `ComponentFrame` component

**Files:**
- Create: `src/components/component-frame.tsx`

- [ ] **Step 1: Create the ComponentFrame component**

```tsx
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

function parseAspectRatio(value: string): string | undefined {
  const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) return undefined;
  const [, w, h] = match;
  if (Number(h) === 0) return undefined;
  return `${w}/${h}`;
}

export function ComponentFrame({
  size = 1,
  aspectRatio,
  minHeight,
  children,
}: {
  size?: number;
  aspectRatio?: string;
  minHeight?: number;
  children: ReactNode;
}) {
  const parsedRatio = aspectRatio ? parseAspectRatio(aspectRatio) : undefined;

  // size <= 1: percentage width, centered
  // size > 1: break out of column via negative margins
  const isBreakout = size > 1;
  const widthPercent = `${size * 100}%`;
  const marginInline = isBreakout ? `${((size - 1) / 2) * -100}%` : undefined;

  return (
    <div
      className={cn("relative my-6 overflow-hidden", !isBreakout && size < 1 && "mx-auto")}
      style={{
        width: widthPercent,
        ...(isBreakout && { marginInline }),
        ...(parsedRatio && { aspectRatio: parsedRatio }),
        ...(minHeight && { minHeight: `${minHeight}px` }),
      }}
    >
      {children}
    </div>
  );
}
```

Write this to `src/components/component-frame.tsx`.

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS (no errors related to the new file)

- [ ] **Step 3: Commit**

```bash
git add src/components/component-frame.tsx
git commit -m "feat: add ComponentFrame sizing wrapper for inline MDX components"
```

---

### Task 2: Create `Caption` component

**Files:**
- Create: `src/components/caption.tsx`

- [ ] **Step 1: Create the Caption component**

```tsx
import type { ReactNode } from "react";

export function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 font-mono text-[13px] leading-relaxed text-muted">
      {children}
    </p>
  );
}
```

Write this to `src/components/caption.tsx`.

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/caption.tsx
git commit -m "feat: add Caption component for MDX figure captions"
```

---

### Task 3: Update `globals.css` — remove panel CSS + update typography

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Remove panel CSS properties**

Remove lines 4–15 (the two `@property` blocks for `--panel-pct` and `--panel-inset`):

```css
/* Register panel layout properties for CSS transitions */
@property --panel-pct {
  syntax: "<percentage>";
  inherits: true;
  initial-value: 40%;
}

@property --panel-inset {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}
```

- [ ] **Step 2: Remove panel transition rules**

Remove the `.panel-transition` media query block (lines 93–100):

```css
/* Smooth panel width transitions between pages (desktop only) */
@media (min-width: 1014px) {
  .panel-transition {
    transition:
      --panel-pct 700ms cubic-bezier(0.16, 1, 0.3, 1),
      --panel-inset 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}
```

Also remove the `.panel-transition` reference from the reduced-motion block. Change:

```css
@media (prefers-reduced-motion: reduce) {
  .panel-transition {
    transition: none !important;
  }

  .animate-in,
  .animate-out,
  .animate-expand-line,
  .entrance,
  .stagger-entrance > * {
    animation: none !important;
  }
}
```

To:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-in,
  .animate-out,
  .animate-expand-line,
  .entrance,
  .stagger-entrance > * {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Remove the custom `lg` breakpoint**

The custom `--breakpoint-lg: 1014px` was set for the split-panel layout. With a single column, we can revert to Tailwind's default `lg: 1024px`. Remove this line from the `@theme inline` block:

```css
  --breakpoint-lg: 1014px;
```

- [ ] **Step 4: Run check**

Run: `bun run check`
Expected: PASS (panel-related CSS no longer referenced by anything after later tasks, but removing now is safe since CSS rules are unused without the classes)

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: remove panel CSS properties and transitions from globals"
```

---

### Task 4: Update `mdx-components.tsx` — typography + register new components

**Files:**
- Modify: `src/lib/mdx-components.tsx`

- [ ] **Step 1: Update typography sizes and register components**

Replace the entire file with:

```tsx
import { Caption } from "@/components/caption";
import { ComponentFrame } from "@/components/component-frame";
import { inlineLink } from "@/lib/styles";
import type { MDXComponents } from "mdx/types";

/* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-has-content */
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-serif text-[36px] leading-[1.15] font-extralight text-ink xl:text-[40px]"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 mb-4 font-serif text-[28px] leading-[1.2] font-light text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 font-serif text-[22px] leading-[1.3] font-light text-ink"
      {...props}
    />
  ),
  p: (props) => <p className="mt-4 text-[18px] leading-[1.7] text-dim" {...props} />,
  a: (props) => <a className={inlineLink} {...props} />,
  ul: (props) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-[18px] leading-[1.7] text-dim marker:text-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-[18px] leading-[1.7] text-dim marker:text-muted"
      {...props}
    />
  ),
  li: (props) => <li className="pl-0.5" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-[16px] text-dim"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-5 overflow-x-auto rounded-md bg-surface p-4 font-mono text-[14px] leading-relaxed text-dim"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-border pl-4 text-[18px] leading-[1.7] text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="mt-5 rounded-md" {...props} />
  ),
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="mt-5 rounded-md border border-accent/20 bg-accent/5 px-5 py-4 text-[18px] leading-[1.7] text-dim">
      {children}
    </div>
  ),
  ComponentFrame,
  Caption,
};
```

Key changes:
- `h1`: 24-32px → 36-40px
- `h2`: 18px → 28px
- `h3`: 16px → 22px
- `p`: 13px → 18px, removed `max-w-lg`
- `ul`/`ol`: 13px → 18px, removed `max-w-lg`
- `code`: 12px → 16px
- `blockquote`: 13px → 18px
- `Callout`: 13px → 18px, removed `max-w-lg`
- Added `ComponentFrame` and `Caption` to the components map

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx-components.tsx
git commit -m "feat: update MDX typography to editorial scale, register ComponentFrame and Caption"
```

---

## Chunk 2: Page Rewrites + Cleanup

### Task 5: Rewrite `(home)/layout.tsx` — centered column wrapper

**Files:**
- Modify: `src/app/(home)/layout.tsx`

- [ ] **Step 1: Replace with centered column layout**

Replace the entire file with:

```tsx
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-[680px] px-6">
      <div className="pt-10 pb-1 print:hidden">
        <BreadcrumbNav />
      </div>
      <main>{children}</main>
    </div>
  );
}
```

This removes imports of `PanelShell`, `PanelTransitionOverlay`, `ScrollEdgeBlur`, and all the panel-positioning wrapper divs.

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS (PanelShell etc. are still on disk but no longer imported — tree-shaking handles it)

- [ ] **Step 3: Commit**

```bash
git add src/app/(home)/layout.tsx
git commit -m "refactor: replace split-panel layout with centered column wrapper"
```

---

### Task 6: Rewrite `(home)/page.tsx` — single column vertical feed

**Files:**
- Modify: `src/app/(home)/page.tsx`

- [ ] **Step 1: Replace with single vertical feed**

Replace the entire file with:

```tsx
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getPreviewBySlug } from "@/lib/content";
import { inlineLink } from "@/lib/styles";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { PreviewConfig } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function Intro() {
  return (
    <div className="pt-8 pb-12">
      <h1 className="font-serif text-[36px] leading-[1.15] font-extralight text-ink xl:text-[40px]">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>.
      </h1>
      <p className="mt-5 text-[18px] leading-[1.7] text-dim">
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

function ItemPreview({ preview }: { preview?: PreviewConfig }) {
  if (!preview?.src) return null;

  const src = Array.isArray(preview.src) ? preview.src[0] : preview.src;
  const isVideo =
    typeof src === "string" && (src.endsWith(".mp4") || src.endsWith(".webm"));

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-lg"
      style={{ background: preview.bg ?? "var(--color-surface)" }}
    >
      {isVideo ? (
        <video
          src={src as string}
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full ${preview.fit === "contain" ? "object-contain" : "object-cover"}`}
          style={preview.position ? { objectPosition: preview.position } : undefined}
        />
      ) : (
        <Image
          src={src}
          alt=""
          fill
          className={preview.fit === "contain" ? "object-contain" : "object-cover"}
          style={{
            ...(preview.position ? { objectPosition: preview.position } : undefined),
            ...(preview.padding ? { padding: `${preview.padding}%` } : undefined),
          }}
        />
      )}
    </div>
  );
}

export default async function Home() {
  const [items, previewMap] = await Promise.all([getAllItems(), getPreviewBySlug()]);

  return (
    <>
      <Intro />
      <StaggerEntrance className="space-y-12 pb-16">
        {items.map((item) => (
          <Link key={item.slug} href={`/${item.slug}`} className="group block">
            <ItemPreview preview={previewMap[item.slug]} />
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="font-serif text-[20px] leading-[1.3] font-light text-ink">
                {item.title}
              </span>
              <span className="shrink-0 font-mono text-[13px] tracking-[0.04em] text-muted uppercase">
                {item.category || DEFAULT_CATEGORY}
              </span>
            </div>
            {item.description && (
              <p className="mt-1.5 text-[16px] leading-[1.6] text-dim">{item.description}</p>
            )}
          </Link>
        ))}
      </StaggerEntrance>
    </>
  );
}
```

Key changes:
- Single layout for all screen sizes (no `lg:hidden` / `lg:flex` splits)
- Removed `PreviewPanel` import and hover preview system
- Full-width preview image per item (16:10 aspect ratio)
- Title + category on same baseline row
- Editorial typography sizes
- Removed table header, mobile WIP notice, `data-preview-slug` attributes

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/(home)/page.tsx
git commit -m "feat: rewrite home page as single-column vertical feed with inline previews"
```

---

### Task 7: Rewrite `(home)/[slug]/page.tsx` — article flow with auto-injected component

**Files:**
- Modify: `src/app/(home)/[slug]/page.tsx`

- [ ] **Step 1: Replace with article flow layout**

Replace the entire file with:

```tsx
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
      <h1 className="font-serif text-[36px] leading-[1.15] font-extralight text-ink xl:text-[40px]">
        {item.title}
      </h1>
      <div className="mt-3 font-mono text-[13px] tracking-[0.04em] text-muted uppercase">
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
        <ComponentFrame>
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
```

Key changes:
- Single layout (no mobile/desktop split)
- Article flow: title → meta → auto-injected component → MDX content
- `ComponentFrame` wraps `LazyPlaygroundComponent` for interactive items at default size
- Removed `var(--panel-split)` references and panel-based positioning
- Added year from `createdAt` to meta row

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/(home)/[slug]/page.tsx
git commit -m "feat: rewrite item page as single-column article flow with auto-injected components"
```

---

### Task 8: Update `about/page.tsx` and `now/page.tsx` — remove panel positioning

**Files:**
- Modify: `src/app/(home)/about/page.tsx`
- Modify: `src/app/(home)/now/page.tsx`

- [ ] **Step 1: Update about page**

In `src/app/(home)/about/page.tsx`, replace the `StaggerEntrance` className (line 14):

Old:
```tsx
<StaggerEntrance className="px-5 pt-10 pb-6 lg:ml-[var(--panel-split)] lg:h-full lg:overflow-y-auto lg:px-8 lg:pt-24 lg:pb-10 xl:px-12">
```

New:
```tsx
<StaggerEntrance className="pt-8 pb-16">
```

Also update the text container (line 15) — remove `max-w-lg` and update font size:

Old:
```tsx
<div className="max-w-lg space-y-4 text-[13px] leading-relaxed text-dim">
```

New:
```tsx
<div className="space-y-4 text-[18px] leading-[1.7] text-dim">
```

Update the social links container margin (line 42):

Old:
```tsx
<div className="mt-8 flex max-w-lg flex-col gap-2">
```

New:
```tsx
<div className="mt-8 flex flex-col gap-2">
```

Update social link text size (line 48):

Old:
```tsx
className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent"
```

New:
```tsx
className="flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-accent"
```

- [ ] **Step 2: Update now page**

In `src/app/(home)/now/page.tsx`, replace the outer div className (line 65):

Old:
```tsx
<div className="px-5 pt-10 pb-6 lg:ml-[var(--panel-split)] lg:h-full lg:overflow-y-auto lg:px-8 lg:pt-24 lg:pb-10 xl:px-12">
```

New:
```tsx
<div className="pt-8 pb-16">
```

Update the h1 size (line 67):

Old:
```tsx
<h1 className="font-serif text-lg font-extralight text-ink lg:text-xl">
```

New:
```tsx
<h1 className="font-serif text-[28px] leading-[1.2] font-extralight text-ink">
```

Update the subtitle size (line 70):

Old:
```tsx
<p className="mt-3 text-2xs text-muted">
```

New:
```tsx
<p className="mt-3 text-[13px] text-muted">
```

Update timeline body text size in `TimelineContent` (line 51):

Old:
```tsx
<p className="mt-2 text-[13px] leading-relaxed text-dim">{entry.body}</p>
```

New:
```tsx
<p className="mt-2 text-[16px] leading-[1.6] text-dim">{entry.body}</p>
```

Update timeline title size (line 39):

Old:
```tsx
<h3 className="min-w-0 flex-1 font-serif text-sm font-light text-ink">
```

New:
```tsx
<h3 className="min-w-0 flex-1 font-serif text-[18px] leading-[1.4] font-light text-ink">
```

Remove `max-w-xl` from timeline container (line 18):

Old:
```tsx
<div className="relative mt-10 max-w-xl">
```

New:
```tsx
<div className="relative mt-10">
```

Update month label size (line 30):

Old:
```tsx
<span className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
```

New:
```tsx
<span className="font-mono text-[13px] tracking-[0.08em] text-muted uppercase">
```

Update tag badge size (line 45):

Old:
```tsx
className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-2xs text-muted"
```

New:
```tsx
className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-[13px] text-muted"
```

- [ ] **Step 3: Run check**

Run: `bun run check`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/(home)/about/page.tsx src/app/(home)/now/page.tsx
git commit -m "refactor: remove panel positioning from about and now pages, update typography"
```

---

### Task 9: Delete unused components

**Files:**
- Delete: `src/components/panel-shell.tsx`
- Delete: `src/components/preview-panel.tsx`
- Delete: `src/components/panel-transition-overlay.tsx`
- Delete: `src/lib/transition-store.ts`

- [ ] **Step 1: Delete files**

```bash
rm src/components/panel-shell.tsx
rm src/components/preview-panel.tsx
rm src/components/panel-transition-overlay.tsx
rm src/lib/transition-store.ts
```

- [ ] **Step 2: Run check**

Run: `bun run check`
Expected: PASS — no remaining imports of these files

- [ ] **Step 3: Commit**

```bash
git add -u src/components/panel-shell.tsx src/components/preview-panel.tsx src/components/panel-transition-overlay.tsx src/lib/transition-store.ts
git commit -m "chore: delete split-panel components and transition store"
```

---

### Task 10: Final verification

- [ ] **Step 1: Run full check**

Run: `bun run check`
Expected: Zero warnings, zero errors

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: Build succeeds with no errors. All pages compile correctly including statically generated item pages.

- [ ] **Step 3: Visual verification**

Start dev server and verify:
- Home page: single centered column, vertical feed with preview images, title + category row, description
- Item pages: article flow with auto-injected interactive component, editorial typography
- About page: centered column, no panel offset
- Now page: centered column, timeline layout
- Breadcrumb: fixed at top of column on all pages
- Mobile: same layout as desktop, just narrower

- [ ] **Step 4: Commit any fixups**

If any issues found during visual verification, fix and commit.
