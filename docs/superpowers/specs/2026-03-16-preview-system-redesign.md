# Preview System Redesign

**Date:** 2026-03-16
**Status:** Approved for implementation

---

## Overview

Replace the current static preview system (frontmatter `preview:` config + `preview.ts` files) with a component-based approach using a per-item `preview.tsx` server component. This enables fully interactive previews on the home page feed, image cycling, and video — all composable from a small library of reusable preview components.

---

## Motivation

Three problems with the current system:

1. The home page only shows static images/video — no way to render interactive components as previews.
2. Preview config is split between MDX frontmatter and `preview.ts` files with overlapping concerns.
3. The `type` discriminated union on `Item` (`"interactive"`, `"content"`, `"image"`, etc.) drives auto-injection of `component.tsx` on the detail page — tying authoring to infrastructure rather than MDX content.

---

## Design

### Per-item `preview.tsx`

Each playground item can optionally include a `preview.tsx` file alongside `content.mdx` and `component.tsx`. This file is a **server component** (no `"use client"`) that:

- Exports `frame` as a named config object for sizing
- Exports a default React component rendered in the home page feed
- Uses `next/dynamic` for any interactive/stateful sub-components

```tsx
// src/playground/voice-capture/preview.tsx
import dynamic from 'next/dynamic'

export const frame = { minHeight: 480 }

const VoiceCapture = dynamic(() => import('./component'))

export default function Preview() {
  return <VoiceCapture />
}
```

```tsx
// src/playground/graeco-latin-squares/preview.tsx
import dynamic from 'next/dynamic'
import img1 from './assets/1.png'
import img2 from './assets/2.png'
// ...

export const frame = { aspectRatio: '1/1' }

const ImageCycle = dynamic(() => import('@/components/preview/image-cycle'))

export default function Preview() {
  return <ImageCycle images={[img1, img2, /* ... */]} interval={0.5} />
}
```

**Why server component?** The `frame` named export must be readable by `content.ts` server-side at build time. If `preview.tsx` were `"use client"`, Next.js prevents dotting into its exports from server context via dynamic import. As a server component, the export is plain data — no boundary issues. Interactive children are brought in via `next/dynamic`, which handles code splitting and lazy loading automatically.

**Constraint:** Hooks and state cannot be written directly inline in `preview.tsx`. Custom interactive logic lives in a separate `"use client"` file (e.g. `component.tsx`) and is imported via `next/dynamic`. For all common cases — composing `ImageCycle`, `PreviewVideo`, `PreviewImage`, or `component.tsx` — this is never a limitation.

**No top-level side effects.** `content.ts` dynamically imports `preview.tsx` at build time solely to read the `frame` config. This import also executes the module body (image imports, `next/dynamic` calls). Authors must not include top-level side effects in `preview.tsx` — the file must be safe to import in a server/Node.js context.

---

### `content.mdx` changes

Frontmatter loses `type`, `frame`, and `preview` fields. Only metadata remains:

```yaml
---
title: "Voice Capture"
description: "..."
createdAt: "2025-01-15"
category: "exploration"
---
```

The MDX body is fully author-driven. To render the interactive component on the detail page, the author imports it directly:

```mdx
import { ComponentFrame } from "@/components/frame"
import VoiceCapture from "./component"

<Frame minHeight={480}>
  <VoiceCapture />
</Frame>

## Notes

Some description and thoughts.
```

**Empty body = no full page.** `hasFullPage` is determined by checking `gray-matter`'s returned `content` string: `content.trim().length > 0`. MDX files containing only import statements (no JSX or prose) are treated as empty — `hasFullPage` is `false`. No detail page is generated and the item is not a link on the home page.

---

### `Frame` component (renamed from `ComponentFrame`)

Renamed to `Frame` everywhere — component file, MDX component map, and existing MDX files.

Gains a `<Suspense>` boundary wrapping children with a skeleton fallback. This catches `next/dynamic` lazy loads from any children automatically, without callers needing to manage Suspense themselves.

```tsx
// server component
<div style={sizing} className={cn("relative my-6 overflow-hidden", ...)}>
  <Suspense fallback={<FrameSkeleton />}>
    {children}
  </Suspense>
</div>
```

The skeleton is a simple surface-colored placeholder, independent of any component's specific background or content.

Static content (images, plain JSX) passes through the Suspense boundary without triggering it. `Frame` stays a server component — no `"use client"`.

---

### Reusable preview components

A small library at `src/components/preview/`, each `"use client"`:

| Component | Purpose |
|-----------|---------|
| `ImageCycle` | Cycles through an array of `StaticImageData` or URL strings at a configurable interval |
| `PreviewVideo` | `<video autoPlay loop muted playsInline>` with `object-cover`/`object-contain`, `objectPosition` |
| `PreviewImage` | Next.js `Image` with `fill`, fit, position, and padding support |

These replace the logic currently inline in the home page `ItemPreview` component. Authors use them directly in `preview.tsx` or ignore them for fully custom previews.

---

### Type system changes

**Removed:**
- `type` discriminated union (`"interactive"` | `"content"` | `"image"` | `"video"` | `"preview"`)
- `Item.frame`
- `Item.preview`
- `PreviewConfig` type
- `PreviewSrc` type

**Added to `Item`:**
- `hasPreview: boolean` — whether `preview.tsx` exists for this item
- `hasFullPage: boolean` — whether `content.mdx` body has non-whitespace content
- `previewFrame?: { size?: number; aspectRatio?: string; minHeight?: number }` — loaded from `preview.tsx`'s `frame` export

---

### Content loading changes (`src/lib/content.ts`)

`parseItem(slug)`:
1. Reads `content.mdx`, extracts frontmatter via `gray-matter`
2. Sets `hasFullPage` = body has non-whitespace content
3. Checks if `src/playground/{slug}/preview.tsx` exists → sets `hasPreview`
4. If `hasPreview`, dynamically imports `preview.tsx` and reads `frame` export → sets `previewFrame`

**Removed:**
- `getPreviewBySlug()` — no longer needed
- `PreviewConfig` loading from frontmatter or `preview.ts`

The existing `preview.ts` files are deleted.

---

### Home page changes (`src/app/(home)/page.tsx`)

- `ItemPreview` component removed, replaced by `LazyPreviewComponent` (same pattern as `LazyPlaygroundComponent`)
- Items with `hasPreview`: render `<Frame {...previewFrame}><LazyPreviewComponent slug={slug} /></Frame>`
- Items with `hasFullPage: false`: render without a `<Link>` wrapper — not clickable
- `getPreviewBySlug()` call removed

---

### Item detail page changes (`src/app/(home)/[slug]/page.tsx`)

- `hasFullPage: false` → returns `notFound()`
- `generateStaticParams` filters to `items.filter(i => i.hasFullPage)` — preview-only items do not get a pre-rendered 404 route
- Auto-injection of `ComponentFrame` + `LazyPlaygroundComponent` removed entirely
- MDX content renders as-is — author controls everything via imports in MDX

---

### Lazy loading for previews

A new `LazyPreviewComponent` client component (extending or alongside `lazy-component.tsx`) lazy-loads `preview.tsx` per slug. The `Frame` component's `Suspense` boundary catches the loading state and shows the skeleton.

The same `React.lazy` + module cache pattern used by `LazyPlaygroundComponent` is used here:

```tsx
// "use client"
const cache = new Map()

function getLazyPreview(slug: string) {
  if (!cache.has(slug)) {
    cache.set(slug, lazy(() => import(`@/playground/${slug}/preview`)))
  }
  return cache.get(slug)
}
```

**Dynamic template literal note:** Both `LazyPlaygroundComponent` and `LazyPreviewComponent` use variable template literals in dynamic imports. This relies on webpack's ability to create a dynamic require context when the pattern is consistent (`@/playground/${slug}/preview`). This works in Next.js with `output: 'export'` or standard builds as long as all slugs are covered by `generateStaticParams`. Verify this pattern survives `bun run build` for both components — if not, an explicit import map (slug → dynamic import) is the fallback.

`LazyPreviewComponent` wraps in the same `CellErrorBoundary` used by `LazyPlaygroundComponent` so a broken `preview.tsx` fails gracefully without crashing the home page feed.

---

## Migration

Existing items need updating:

1. **Items with `preview.ts`**: Convert to `preview.tsx` using `ImageCycle`, `PreviewVideo`, or `PreviewImage` as appropriate.
2. **Items with `type: "interactive"`**: Add `preview.tsx` with the component. Remove auto-injection reliance — add explicit `<Frame><Component /></Frame>` to MDX body if a full page is desired.
3. **Items with `type: "content"`**: No preview needed unless desired. Remove `type` from frontmatter.
4. **`ComponentFrame` in existing MDX files**: Rename to `Frame`.

---

## File changes summary

| File | Change |
|------|--------|
| `src/lib/types.ts` | Remove `PreviewConfig`, `PreviewSrc`, `type` union; add `hasPreview`, `hasFullPage`, `previewFrame` to `Item` |
| `src/lib/content.ts` | Remove `getPreviewBySlug`; update `parseItem` to detect `preview.tsx` and read `frame` |
| `src/components/component-frame.tsx` | Rename to `frame.tsx`; add `Suspense` + skeleton; rename export to `Frame` |
| `src/lib/lazy-component.tsx` | Add `LazyPreviewComponent` alongside existing `LazyPlaygroundComponent` |
| `src/components/preview/image-cycle.tsx` | New: image cycling component |
| `src/components/preview/preview-video.tsx` | New: video component |
| `src/components/preview/preview-image.tsx` | New: image component |
| `src/app/(home)/page.tsx` | Replace `ItemPreview` with `LazyPreviewComponent`; conditional linking |
| `src/app/(home)/[slug]/page.tsx` | Remove auto-injection; add `hasFullPage` guard; filter `generateStaticParams` |
| `src/lib/mdx-components.tsx` | Rename `ComponentFrame` → `Frame` in component map |
| `src/playground/*/content.mdx` | Remove `type`, `frame`, `preview` from frontmatter |
| `src/playground/*/preview.ts` | Delete; replace with `preview.tsx` |
