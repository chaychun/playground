# Playground — Personal Portfolio & Interactive Component Showcase

## Project Overview

A portfolio site that renders a vertical feed of interactive components and media items, all displayed directly on the home page. Items are sorted by creation date (newest first).

### Item Types

- **Interactive** — full component rendered inline on the home page (loaded from `src/playground/<slug>/component.tsx`)
- **Preview** — lightweight visual component for external projects (loaded from `src/preview/<name>.tsx`)
- **Image** — static image
- **Video** — autoplaying looped video

All items can optionally include named external links (displayed as pills below the description).

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (inline theme in `globals.css`)
- **Fonts:** Manrope (sans) + IBM Plex Mono (mono) via `next/font/google`
- **Components:** Radix UI primitives
- **Build:** Bun, React Compiler enabled
- **Linting:** Oxlint (plugins: typescript, react, jsx-a11y, import, unicorn)
- **Formatting:** Oxfmt (2-space indent, double quotes, trailing commas, sorted imports)

## Architecture

### Centralized Item Registry

All items are defined in `src/data/items.ts` as a single array. No filesystem scanning — the data file is the registry.

### Types

```ts
type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string; // ISO date, e.g. "2026-02-25"
  links?: { label: string; href: string }[];
} & (
  | { type: "interactive" }
  | { type: "preview"; name: string; props?: Record<string, unknown> }
  | { type: "image"; src: string }
  | { type: "video"; src: string }
);
```

### Rendering Flow

1. Home page imports items from `src/data/items.ts`, sorts by `createdAt` (newest first)
2. Feed renders each item in a vertical list:
   - `interactive` → `LazyMount` + `React.lazy` loads the component from `src/playground/<slug>/component.tsx`
   - `preview` → `LazyMount` + `React.lazy` loads a preview component from `src/preview/<name>.tsx`
   - `image` / `video` → rendered directly
3. `LazyMount` uses IntersectionObserver to defer mounting until the item is near the viewport. Once mounted, it stays mounted (state persists).

### Interactive Components

Each interactive component lives in its own folder under `src/playground/`:

```
src/playground/
├── polaroid-stack/
│   └── component.tsx     # "use client", single default export
├── cursor-follower/
│   └── component.tsx
```

**Conventions:**

- Folder name = slug (must match `slug` in `items.ts`)
- `component.tsx` MUST use `"use client"` and export a single default component

### Preview Components

Lightweight visual components for non-interactive items (e.g. external project thumbnails):

```
src/preview/
├── placeholder.tsx       # Generic placeholder
├── my-project.tsx        # Custom preview for an external project
```

**Conventions:**

- File name = `name` field in item config
- Must use `"use client"` and export a single default component

### Routes

```
src/app/
├── (site)/
│   ├── page.tsx            # Home — vertical feed of all items
│   ├── about/page.tsx
│   └── now/page.tsx
└── design-system/page.tsx
```

### File Organization

```
src/
├── app/                    # Next.js routes
│   ├── globals.css         # Design tokens + Tailwind theme
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── (site)/
│       └── page.tsx        # Home — item feed
├── playground/             # Interactive components
│   └── <slug>/
│       └── component.tsx
├── preview/                # Preview components
│   └── <name>.tsx
├── components/             # Shared UI components
├── data/                   # Item definitions
│   └── items.ts
├── lib/                    # Utilities + types
│   ├── cn.ts
│   ├── types.ts
│   ├── lazy-component.tsx  # React.lazy wrapper for playground components
│   ├── lazy-preview.tsx    # React.lazy wrapper for preview components
│   └── lazy-mount.tsx      # IntersectionObserver-based deferred mounting
```

## Key Conventions

### Code Style

- Run `bun run check` (oxlint + oxfmt) before committing
- Use `@/*` path alias for all imports from `src/`
- Use the `cn()` utility from `@/lib/cn` for composing Tailwind classes
- Prefer Radix UI primitives for accessible interactive elements
- Semicolons required, double quotes for strings

### Design Tokens

- 9 semantic colors: paper, surface, border, mid, muted, link, dim, ink, ink-inv
- Dark mode via `prefers-color-scheme` media query (CSS variables swap)
- Type scale: 2xs (10px) → 3xl (32px)
- All tokens defined in `src/app/globals.css` under `@theme inline`

### Component Patterns

- Interactive components use `"use client"` directive
- Dynamic imports via `React.lazy` with module-level cache for lazy loading
- IntersectionObserver-based mounting (`LazyMount`) to avoid loading all components at once
- Server components by default; client only when needed
