# Preview System Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static preview system (frontmatter `preview:` + `preview.ts` files) with per-item `preview.tsx` server components that enable fully interactive previews on the home page.

**Architecture:** Each playground item optionally ships a `preview.tsx` server component that exports `frame` config and a default React component. The home page renders these via `LazyPreviewComponent` inside a `Frame` container that provides Suspense. The `type` discriminated union on `Item` is removed; `hasPreview` and `hasFullPage` replace it.

**Tech Stack:** Next.js App Router, React Suspense, `next/dynamic`, `gray-matter`, TypeScript

---

## Chunk 1: Core infrastructure (types, Frame, preview components, lazy loader)

### Task 1: Update `src/lib/types.ts`

**Files:**
- Modify: `src/lib/types.ts`

- [ ] Replace the entire file with the simplified `Item` type:

```ts
export type ItemCategory = "exploration" | "pattern" | "case study";
export const DEFAULT_CATEGORY: ItemCategory = "exploration";

export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  category?: ItemCategory;
  links?: { label: string; href: string }[];
  hasPreview: boolean;
  hasFullPage: boolean;
  previewFrame?: { size?: number; aspectRatio?: string; minHeight?: number };
};
```

Note: `PreviewConfig`, `PreviewSrc`, and the discriminated union (`type`, `frame`, `preview`) are all removed.

---

### Task 2: Create `src/components/frame.tsx`

**Files:**
- Create: `src/components/frame.tsx`

The `Frame` component replaces `ComponentFrame`. It adds a `<Suspense>` boundary that catches lazy-loaded children (both `LazyPreviewComponent` on the home page and `LazyPlaygroundComponent` in MDX). The skeleton is a simple surface-colored placeholder.

- [ ] Create the file:

```tsx
import { cn } from "@/lib/cn";
import { Suspense } from "react";
import type { ReactNode } from "react";

function parseAspectRatio(value: string): string | undefined {
  const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) return undefined;
  const [, w, h] = match;
  if (Number(h) === 0) return undefined;
  return `${w}/${h}`;
}

function FrameSkeleton() {
  return <div className="absolute inset-0 bg-surface" />;
}

export function Frame({
  size = 1,
  aspectRatio,
  minHeight,
  className,
  children,
}: {
  size?: number;
  aspectRatio?: string;
  minHeight?: number;
  className?: string;
  children: ReactNode;
}) {
  const parsedRatio = aspectRatio ? parseAspectRatio(aspectRatio) : undefined;
  const isBreakout = size > 1;
  const widthPercent = `${size * 100}%`;
  const marginInline = isBreakout ? `${((size - 1) / 2) * -100}%` : undefined;

  return (
    <div
      className={cn("relative my-6 overflow-hidden rounded-lg", !isBreakout && "mx-auto", className)}
      style={{
        width: widthPercent,
        ...(isBreakout && { marginInline }),
        ...(parsedRatio && { aspectRatio: parsedRatio }),
        ...(minHeight && { minHeight: `${minHeight}px` }),
      }}
    >
      <Suspense fallback={<FrameSkeleton />}>
        {children}
      </Suspense>
    </div>
  );
}
```

Note: `rounded-lg` is added to `Frame` (vs the old `ComponentFrame`) because the rounding previously lived on the inner div in `ItemPreview`. Now `Frame` is the clipping container and owns the border radius.

---

### Task 3: Create reusable preview components

**Files:**
- Create: `src/components/preview/image-cycle.tsx`
- Create: `src/components/preview/preview-video.tsx`
- Create: `src/components/preview/preview-image.tsx`

These are `"use client"` components imported via `next/dynamic` from `preview.tsx` files.

- [ ] Create `src/components/preview/image-cycle.tsx`:

```tsx
"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export default function ImageCycle({
  images,
  interval = 1,
  position,
}: {
  images: (StaticImageData | string)[];
  interval?: number;
  position?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <Image
      src={images[index]}
      alt=""
      fill
      sizes="(max-width: 744px) 100vw, 680px"
      className="object-cover"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
```

- [ ] Create `src/components/preview/preview-video.tsx`:

```tsx
"use client";

export default function PreviewVideo({
  src,
  fit = "cover",
  position,
}: {
  src: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
```

- [ ] Create `src/components/preview/preview-image.tsx`:

```tsx
"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

export default function PreviewImage({
  src,
  fit = "cover",
  position,
  padding,
}: {
  src: StaticImageData | string;
  fit?: "cover" | "contain";
  position?: string;
  padding?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 744px) 100vw, 680px"
      className={fit === "contain" ? "object-contain" : "object-cover"}
      style={{
        ...(position ? { objectPosition: position } : {}),
        ...(padding ? { padding: `${padding}%` } : {}),
      }}
    />
  );
}
```

Note: All three use default exports so `next/dynamic` can lazily import them without `.then(m => m.Foo)` gymnastics.

---

### Task 4: Add `LazyPreviewComponent` to `src/lib/lazy-component.tsx`

**Files:**
- Modify: `src/lib/lazy-component.tsx`

- [ ] Add `LazyPreviewComponent` alongside the existing `LazyPlaygroundComponent`. Both share `CellErrorBoundary`. `LazyPreviewComponent` has NO inner `Suspense` — `Frame` provides it.

Replace the entire file with:

```tsx
"use client";

import { Component as ReactComponent, Suspense, lazy } from "react";
import type { ComponentType, ReactNode } from "react";

const componentCache = new Map<string, React.LazyExoticComponent<ComponentType>>();
const previewCache = new Map<string, React.LazyExoticComponent<ComponentType>>();

function getLazyComponent(slug: string) {
  let component = componentCache.get(slug);
  if (!component) {
    component = lazy(() => import(`@/playground/${slug}/component`));
    componentCache.set(slug, component);
  }
  return component;
}

function getLazyPreview(slug: string) {
  let component = previewCache.get(slug);
  if (!component) {
    component = lazy(() => import(`@/playground/${slug}/preview`));
    previewCache.set(slug, component);
  }
  return component;
}

class CellErrorBoundary extends ReactComponent<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center text-meta text-muted">
          Failed to load
        </div>
      );
    }
    return this.props.children;
  }
}

export function LazyPlaygroundComponent({
  slug,
  fallback,
}: {
  slug: string;
  fallback?: ReactNode;
}) {
  const Component = getLazyComponent(slug);
  return (
    <CellErrorBoundary>
      <Suspense fallback={fallback ?? null}>
        <Component />
      </Suspense>
    </CellErrorBoundary>
  );
}

export function LazyPreviewComponent({ slug }: { slug: string }) {
  const Component = getLazyPreview(slug);
  return (
    <CellErrorBoundary>
      <Component />
    </CellErrorBoundary>
  );
}
```

---

### Task 5: Update `src/lib/content.ts`

**Files:**
- Modify: `src/lib/content.ts`

Changes:
- Import `existsSync` from `node:fs`
- Remove `loadLocalPreview` / `getPreviewBySlug`
- `parseItem` detects `preview.tsx`, loads `frame` export, computes `hasFullPage`
- `hasFullPage`: strip import lines from body, then check if anything remains

- [ ] Replace the entire file:

```ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { mdxComponents } from "@/lib/mdx-components";
import type { Item } from "@/lib/types";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

const PLAYGROUND_DIR = join(process.cwd(), "src/playground");

function getContentSlugs(): string[] {
  return readdirSync(PLAYGROUND_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => {
      try {
        readFileSync(join(PLAYGROUND_DIR, slug, "content.mdx"), "utf-8");
        return true;
      } catch {
        return false;
      }
    });
}

function hasBodyContent(raw: string): boolean {
  const stripped = raw.replace(/^import\s+[^\n]*\n?/gm, "").trim();
  return stripped.length > 0;
}

async function parseItem(slug: string): Promise<{ item: Item; raw: string }> {
  const filePath = join(PLAYGROUND_DIR, slug, "content.mdx");
  const source = readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  const previewTsxPath = join(PLAYGROUND_DIR, slug, "preview.tsx");
  const hasPreview = existsSync(previewTsxPath);

  let previewFrame: Item["previewFrame"];
  if (hasPreview) {
    try {
      const mod = (await import(`@/playground/${slug}/preview`)) as {
        frame?: Item["previewFrame"];
      };
      previewFrame = mod.frame;
    } catch {
      // preview.tsx exists but failed to import; hasPreview stays true
    }
  }

  const item: Item = {
    slug,
    title: data.title ?? slug,
    description: data.description,
    createdAt: data.createdAt ?? "",
    category: data.category,
    links: data.links,
    hasPreview,
    hasFullPage: hasBodyContent(content),
    ...(previewFrame ? { previewFrame } : {}),
  };

  return { item, raw: content };
}

export async function getAllItems(): Promise<Item[]> {
  const slugs = getContentSlugs();
  const items = await Promise.all(slugs.map(async (slug) => (await parseItem(slug)).item));
  return items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getItemBySlug(
  slug: string,
): Promise<{ item: Item; content: React.ReactElement } | null> {
  try {
    const { item, raw } = await parseItem(slug);
    const { content } = await compileMDX({
      source: raw,
      components: mdxComponents,
    });
    return { item, content };
  } catch {
    return null;
  }
}
```

---

## Chunk 2: MDX components, pages, and per-item migrations

### Task 6: Update `src/lib/mdx-components.tsx`

**Files:**
- Modify: `src/lib/mdx-components.tsx`

- [ ] Replace the `ComponentFrame` import with `Frame` from the new path, and update the component map key:

```tsx
import { Caption } from "@/components/caption";
import { Frame } from "@/components/frame";
import { inlineLink } from "@/lib/styles";
import type { MDXComponents } from "mdx/types";

/* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-has-content */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="font-serif text-heading font-extralight text-ink" {...props} />,
  h2: (props) => <h2 className="mt-10 mb-4 font-serif text-h2 font-light text-ink" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 font-sans text-h3 font-light text-ink" {...props} />,
  p: (props) => <p className="mt-4 text-body text-dim" {...props} />,
  a: (props) => <a className={inlineLink} {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-dim marker:text-muted" {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-body text-dim marker:text-muted"
      {...props}
    />
  ),
  li: (props) => <li className="pl-0.5" {...props} />,
  code: (props) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-body-sm text-dim" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-5 overflow-x-auto rounded-md bg-surface p-4 font-mono text-body-sm text-dim"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-border pl-4 text-body text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="mt-5 rounded-md" {...props} />
  ),
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="mt-5 rounded-md border border-accent/20 bg-accent/5 px-5 py-4 text-body text-dim">
      {children}
    </div>
  ),
  Frame,
  Caption,
};
```

---

### Task 7: Update `src/app/(home)/page.tsx`

**Files:**
- Modify: `src/app/(home)/page.tsx`

Changes:
- Remove `ItemPreview`, `getPreviewBySlug`, `PreviewConfig` import
- Add `Frame` + `LazyPreviewComponent` imports
- Items with `hasPreview`: render `<Frame {...item.previewFrame}><LazyPreviewComponent slug={slug} /></Frame>`
- Items without `hasFullPage`: render without `<Link>` wrapper

- [ ] Replace the entire file:

```tsx
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

function ItemCard({ item }: { item: Item }) {
  return (
    <>
      {item.hasPreview && (
        <Frame aspectRatio="16/10" {...item.previewFrame}>
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
```

Note: `aspectRatio="16/10"` is the default fallback when `previewFrame` has no `aspectRatio` (matching the old `ItemPreview` default). Spread `{...item.previewFrame}` overrides it when the preview declares its own sizing.

---

### Task 8: Update `src/app/(home)/[slug]/page.tsx`

**Files:**
- Modify: `src/app/(home)/[slug]/page.tsx`

Changes:
- `generateStaticParams` filters to `hasFullPage` items
- `hasFullPage: false` items return `notFound()`
- Auto-injection of `ComponentFrame` + `LazyPlaygroundComponent` removed

- [ ] Replace the entire file:

```tsx
import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getItemBySlug } from "@/lib/content";
import { DEFAULT_CATEGORY } from "@/lib/types";
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
  return { title: result ? `${result.item.title} — Playground` : "Not Found" };
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
      <div className="mt-3 font-mono text-meta tracking-[0.04em] text-muted uppercase">
        {item.category || DEFAULT_CATEGORY}
        {item.createdAt && (
          <>
            <span className="mx-2 text-border">·</span>
            {new Date(item.createdAt).getFullYear()}
          </>
        )}
      </div>

      <div className="mt-8">{content}</div>
    </StaggerEntrance>
  );
}
```

---

### Task 9: Create per-item `preview.tsx` files

**Files:**
- Create: `src/playground/graeco-latin-squares/preview.tsx`
- Create: `src/playground/voice-capture/preview.tsx`
- Create: `src/playground/info-modal/preview.tsx`
- Create: `src/playground/polaroid-carousel/preview.tsx`

- [ ] Create `src/playground/graeco-latin-squares/preview.tsx`:

```tsx
import dynamic from "next/dynamic";

import img1 from "./graeco-latin-4x4.png";
import img2 from "./graeco-latin-4x4-2.png";
import img3 from "./graeco-latin-4x4-3.png";
import img4 from "./graeco-latin-4x4-4.png";
import img5 from "./graeco-latin-4x4-5.png";
import img6 from "./graeco-latin-4x4-6.png";
import img7 from "./graeco-latin-4x4-7.png";
import img8 from "./graeco-latin-4x4-8.png";

export const frame = { aspectRatio: "1/1" };

const ImageCycle = dynamic(() => import("@/components/preview/image-cycle"));

export default function Preview() {
  return (
    <ImageCycle
      images={[img1, img2, img3, img4, img5, img6, img7, img8]}
      interval={0.5}
      position="top left"
    />
  );
}
```

- [ ] Create `src/playground/voice-capture/preview.tsx`:

```tsx
import dynamic from "next/dynamic";

export const frame = { minHeight: 480 };

const VoiceCapture = dynamic(() => import("./component"));

export default function Preview() {
  return <VoiceCapture />;
}
```

- [ ] Create `src/playground/info-modal/preview.tsx`:

```tsx
import dynamic from "next/dynamic";

export const frame = { aspectRatio: "4/3" };

const PreviewVideo = dynamic(() => import("@/components/preview/preview-video"));

export default function Preview() {
  return (
    <div className="absolute inset-0" style={{ background: "#745340" }}>
      <PreviewVideo
        src="https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/info-modal.mp4"
        fit="contain"
      />
    </div>
  );
}
```

Note: The old `padding: 10` effect (10% padding around the video) is omitted here since `PreviewVideo` doesn't support it. The video fills the brown background container at `object-contain` which achieves the same visual.

- [ ] Create `src/playground/polaroid-carousel/preview.tsx`:

```tsx
import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const PreviewImage = dynamic(() => import("@/components/preview/preview-image"));

export default function Preview() {
  return <PreviewImage src="/previews/polaroid-carousel.webp" />;
}
```

---

### Task 10: Update per-item `content.mdx` frontmatter and bodies

**Files:**
- Modify: `src/playground/graeco-latin-squares/content.mdx`
- Modify: `src/playground/voice-capture/content.mdx`
- Modify: `src/playground/info-modal/content.mdx`
- Modify: `src/playground/polaroid-carousel/content.mdx`
- Modify: `src/playground/test-mdx/content.mdx`

Remove `type`, `frame`, and `preview` from frontmatter. Add `<Frame>` + component import to the MDX body for items that should show the interactive component on the detail page.

- [ ] Update `src/playground/graeco-latin-squares/content.mdx`:

```mdx
---
title: "Graeco-Latin Squares"
description: "Randomized patterns from orthogonal Latin square constructions"
createdAt: "2026-03-09"
category: "exploration"
---

import { Frame } from "@/components/frame"
import GraecoLatinSquares from "./component"

<Frame aspectRatio="1/1">
  <GraecoLatinSquares />
</Frame>

Randomized patterns from orthogonal Latin square constructions.
```

- [ ] Update `src/playground/voice-capture/content.mdx`:

```mdx
---
title: "Voice Capture"
description: "A mobile navigation pattern with an expandable voice capture pane."
createdAt: "2026-03-02"
category: "exploration"
---

import { Frame } from "@/components/frame"
import VoiceCapture from "./component"

<Frame minHeight={480}>
  <VoiceCapture />
</Frame>

A mobile navigation pattern with an expandable voice capture pane. The interaction explores how voice input can be integrated into a compact navigation bar without disrupting the spatial layout.
```

- [ ] Update `src/playground/info-modal/content.mdx`:

```mdx
---
title: "Info Modal"
description: "An expandable info card with spring-animated entrance and backdrop blur."
createdAt: "2026-02-08"
category: "pattern"
---

import { Frame } from "@/components/frame"
import InfoModal from "./component"

<Frame aspectRatio="4/3">
  <InfoModal />
</Frame>

An expandable info card with spring-animated entrance and backdrop blur. This pattern demonstrates how a compact information trigger can expand into a detailed overlay with fluid motion.
```

- [ ] Update `src/playground/polaroid-carousel/content.mdx`:

```mdx
---
title: "Polaroid Carousel"
description: "A stack of cards that expands into a gesture-based carousel modal."
createdAt: "2026-02-25"
category: "exploration"
---

import { Frame } from "@/components/frame"
import PolaroidCarousel from "./component"

<Frame minHeight={440}>
  <PolaroidCarousel />
</Frame>

A stack of cards that expands into a gesture-based carousel modal. The transition from stacked to expanded state uses spring physics, and the carousel supports swipe gestures for navigation.
```

- [ ] Update `src/playground/test-mdx/content.mdx` — remove only the `type: "content"` line from frontmatter (body stays unchanged):

```mdx
---
title: "MDX Test Page"
description: "A test page demonstrating all MDX rendering capabilities."
createdAt: "2026-03-09"
category: "exploration"
---
```

(Body content unchanged.)

---

### Task 11: Delete old files

**Files:**
- Delete: `src/playground/graeco-latin-squares/preview.ts`
- Delete: `src/components/component-frame.tsx`

- [ ] Delete `src/playground/graeco-latin-squares/preview.ts`:

```bash
rm src/playground/graeco-latin-squares/preview.ts
```

- [ ] Delete `src/components/component-frame.tsx`:

```bash
rm src/components/component-frame.tsx
```

---

### Task 12: Verify

- [ ] Run `bun run check`:

```bash
bun run check
```

Expected: zero warnings, zero errors.

- [ ] Run `bun run build` to verify Next.js static generation works end-to-end:

```bash
bun run build
```

Expected: successful build with all routes generated. Check that:
- Home page (`/`) generates without error
- All item routes with `hasFullPage: true` are generated
- Preview-only items (if any) are NOT in generated params
