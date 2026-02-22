# Playground — Personal Portfolio & Interactive Component Showcase

## Project Overview

A portfolio site that renders a custom grid of interactive components and links. Each grid item can be portrait or landscape orientation, sorted by creation date (newest first).

### Grid Item Types

- **Inline Interactive** — component renders directly in the grid, immediately interactive
- **Preview Interactive** — shows a preview (image/video) in the grid, links to a dedicated page with the full interactive component
- **External Link** — preview card linking to an external URL

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

### Filesystem-Driven Component Registry

No manual registry or items list. The filesystem IS the registry.

Each interactive component lives in its own folder under `src/playground/`:

```
src/playground/
├── spring-physics/
│   ├── meta.ts           # ComponentMeta — title, orientation, display mode, createdAt
│   └── component.tsx     # "use client", single default export
├── hero-gradient/
│   ├── meta.ts
│   └── component.tsx
```

**Enforced conventions:**

- Folder name = ID = route slug (e.g. `spring-physics` → `/playground/spring-physics`)
- Every folder MUST have `meta.ts` and `component.tsx`
- `component.tsx` MUST export a single default component
- `meta.ts` is separate from the component to allow importing metadata without pulling in client code

### Types

```ts
// ComponentMeta — defined in each playground component's meta.ts
type ComponentMeta = {
  title: string;
  orientation: "portrait" | "landscape";
  createdAt: string; // ISO date, e.g. "2025-06-15"
} & (
  | { display: "inline" }
  | { display: "preview"; preview: { type: "image" | "video"; src: string } }
);

// LinkItem — defined in src/data/links.ts
type LinkItem = {
  type: "external-link";
  id: string;
  title: string;
  orientation: "portrait" | "landscape";
  createdAt: string;
  preview: { type: "image" | "video"; src: string };
  href: string;
};
```

### Discovery & Rendering Flow

1. Home page (server component) calls `getPlaygroundItems()` which scans `src/playground/` directories and imports their `meta.ts`
2. External links are imported from `src/data/links.ts`
3. Both are merged and sorted by `createdAt` (newest first)
4. Grid renders each item:
   - `display: "inline"` → `next/dynamic` loads and renders the component live in the grid
   - `display: "preview"` → renders preview image/video, wraps in link to `/playground/[slug]`
   - `external-link` → renders preview image/video, wraps in external link

### Routes

```
src/app/
├── page.tsx                    # Grid — server component, discovers items
└── playground/
    └── [slug]/
        └── page.tsx            # Full page view — uses generateStaticParams
```

### File Organization

```
src/
├── app/                        # Next.js routes
│   ├── globals.css             # Design tokens + Tailwind theme
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Home — portfolio grid
│   └── playground/
│       └── [slug]/
│           └── page.tsx        # Full interactive component page
├── playground/                 # Interactive components (filesystem = registry)
│   └── <slug>/
│       ├── meta.ts
│       └── component.tsx
├── components/                 # Shared UI components (grid, cells, etc.)
│   └── grid/
├── data/                       # External link definitions
│   └── links.ts
├── lib/                        # Utilities + types
│   ├── cn.ts
│   ├── types.ts
│   └── get-playground-items.ts
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
- Dynamic imports via `next/dynamic` for grid-embedded inline components
- Server components by default; client only when needed
- `meta.ts` files are always server-safe (no "use client", no heavy deps)
