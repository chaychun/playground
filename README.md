# chayut.me — Playground

Personal site and interactive component showcase. If you're here to see how things are built, welcome — that's exactly why this repo is public.

The home page is a vertical feed of self-contained interactive experiments, motion studies, and design explorations. Some are full articles; others are just a fun thing I made.

## Stack

- **[Next.js](https://nextjs.org/)** (App Router) + **React 19**
- **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Motion](https://motion.dev/)** for animations
- **[MDX](https://mdxjs.com/)** via `next-mdx-remote` for content
- **[Radix UI](https://www.radix-ui.com/)** for accessible primitives
- **[Bun](https://bun.sh/)**
- **[oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://github.com/nicolo-ribaudo/oxfmt)**

## Project Structure

```
src/
├── app/            # Next.js App Router pages and root layout
├── components/     # Site shell components (nav, feed, MDX renderer, etc.)
├── playground/     # Each item lives here in its own folder
├── lib/            # Content loading, types, utilities
├── preview/        # Helper components for feed card previews
└── data/           # Static data files
```

The key separation: `src/components/` is for site-wide things. `src/playground/` is where each individual item lives, self-contained.

## How Playground Items Work

Each item is a folder under `src/playground/<slug>/`. The only required file is `content.mdx`:

```
src/playground/my-item/
├── content.mdx         # Required — frontmatter + optional article body
├── preview.tsx         # What renders in the home feed card
├── my-component.tsx    # The actual component
├── components.ts       # Barrel export to make components available in MDX
└── assets/             # Images, data, whatever
```

**`content.mdx`** holds the frontmatter and optional article body. Frontmatter drives the feed card:

```yaml
---
title: "My Item"
description: "What this is about."
createdAt: "2026-03"
category: "playground" # or "exploration"
links:
  - label: "GitHub"
    href: "https://..."
---
```

If there's body content below the frontmatter, the item gets a full-page view at `/playground/<slug>`. Otherwise it's preview-only.

**`preview.tsx`** defines what shows in the home feed card. The optional named `frame` export controls card dimensions (`aspectRatio`, `minHeight`). Previews are lazy-loaded via `next/dynamic` so they don't block the feed.

**`components.ts`** exports any React components you want to use directly in your MDX body — they're automatically injected into that item's MDX scope by name.

Content loading happens in [`src/lib/content.ts`](src/lib/content.ts), which scans the `src/playground/` directory at build time.

See [`docs/authoring.md`](docs/authoring.md) for the full guide.

## Key Shell Components

**[`StickyHeader`](src/components/sticky-header/)** — The frosted header at the top. Uses CSS `mask-image` with a Catmull-Rom spline to get a smooth, non-linear fade. Multiple blur layers are stacked and masked independently to achieve the hazy glass effect. Parameters were tuned in development using [DialKit](https://github.com/nicolo-ribaudo/dialkit).

**[`CursorFollower`](src/components/cursor-follower.tsx)** — The custom cursor that trails behind the pointer with a spring animation (`motion/react`). It reads `data-cursor` attributes on elements to show contextual labels ("See Exploration", "Visit GitHub", etc.) and jumps immediately to the new target on hover to avoid lag. Disabled on touch devices.

**[`StaggerEntrance`](src/components/stagger-entrance.tsx)** — Sequential entrance animation for the feed. Pure CSS animation with JS-injected `animation-delay` values per child. Respects `prefers-reduced-motion`.

**[`TextEffect`](src/components/text-effect.tsx)** — Animates text by splitting it into words, characters, or lines and applying Framer Motion variants with staggered timing. Ships several presets (blur, fade, slide, scale) and supports custom variants.

**[`Frame`](src/components/frame.tsx)** — Layout wrapper used in both the feed and article bodies. Configurable aspect ratio and min-height, with an optional breakout mode to exceed the content column width.

## Running Locally

```sh
bun install
bun dev
```
