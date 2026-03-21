# Authoring Guide

How to add and configure items in the playground feed.

## File Structure

Each item lives in its own directory under `src/playground/<slug>/`:

```
src/playground/my-item/
├── content.mdx       # required — metadata and optional article body
├── preview.tsx       # preferred — what appears in the home feed
└── (anything else)   # assets, components, utilities — no restrictions
```

## `content.mdx`

Required. Every item must have one.

**Frontmatter fields:**

```yaml
---
title: "My Item" # required
description: "One paragraph." # shown in the feed, can be longer
createdAt: "2026-03" # year-month — determines sort order
category: "exploration" # "playground" | "exploration"
links: # optional external links
  - label: "GitHub"
    href: "https://..."
---
```

**Body content** is optional. If you write anything below the frontmatter (beyond bare imports), the item gets a full-page view at `/playground/<slug>`. Leave the body empty for items that are preview-only.

When writing body content, you can import and use anything via relative paths:

```mdx
import MyComponent from "./my-component";
import { Frame } from "@/components/frame";

<Frame aspectRatio="4/3">
  <MyComponent />
</Frame>

Some prose about the thing.
```

## `preview.tsx`

Preferred. Defines what renders in the home feed card. If absent, the feed card shows no preview (just title + description).

Two common patterns:

**1. Wrap an interactive component** (lazy-loaded to avoid blocking the feed):

```tsx
import dynamic from "next/dynamic";

export const frame = { aspectRatio: "4/3", minHeight: 450 };

const MyComponent = dynamic(() => import("./my-component"));

export default function Preview() {
  return <MyComponent />;
}
```

**2. Cycle through static screenshots:**

```tsx
import dynamic from "next/dynamic";
import img1 from "./screenshot-1.png";
import img2 from "./screenshot-2.png";

export const frame = { aspectRatio: "1/1" };

const ImageCycle = dynamic(() => import("@/components/preview/image-cycle"));

export default function Preview() {
  return <ImageCycle images={[img1, img2]} interval={0.5} />;
}
```

### `frame` export

The optional named `frame` export controls the preview card dimensions:

| Option        | Type     | Description                             |
| ------------- | -------- | --------------------------------------- |
| `aspectRatio` | `string` | CSS aspect ratio, e.g. `"4/3"`, `"1/1"` |
| `minHeight`   | `number` | Minimum height in pixels                |

## Interactive Components

Completely optional. Items can be pure articles with no interactive piece.

If you have React components that you want to use in your `content.mdx`, you **must** export them from a `components.ts` file inside your slug folder:

```ts
// src/playground/my-item/components.ts
export { default as MyComponent } from "./my-component";
```

Any component exported from `components.ts` with a Capitalized name will become automatically available globally within that slug's MDX. Both client and server components work fine.

For components not used inside `content.mdx` (like the preview frame itself), there are no constraints on naming or exports.

Two additional components are also automatically injected on all `content.mdx` files: `Frame` and `Caption` which are used for authoring.

### Keep everything inside the slug folder

Treat each item directory as its own self-contained world. Assets, utilities, sub-components, data files, types — all of it lives inside `src/playground/<slug>/`. Don't reach into `src/components/` for item-specific things.

`src/components/` is reserved for site shell components that are genuinely reused across the site (layout, navigation, the feed, MDX rendering, etc.).

## Disabling an Item

Rename `content.mdx` to `content.mdx.disabled`. The item will be excluded from the feed without deleting any work.
