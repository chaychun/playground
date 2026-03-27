# Project Structure

## Organization Philosophy

Feature-colocation: each playground item is a self-contained module. Site shell (layout, navigation, shared utilities) lives separately from content. Content collections are per-section — each section owns its data loading logic.

## Directory Patterns

### App Routes (`src/app/`)

Next.js App Router. Route groups separate concerns:

- `(home)/` — Routes under the main site shell (home, about, item detail pages)
- `/playground/` — Playground section with its own layout (sidebar + main panel)
- `/work/` — Work list and detail pages
- `/writing/` — Writing section (planned)

### Site Shell (`src/components/`)

Shared layout and UI components used across the site. No playground-item-specific code lives here.

Examples: `sticky-header.tsx`, `frame.tsx`, `stagger-entrance.tsx`, `cursor-follower.tsx`

### Playground Items (`src/playground/<slug>/`)

Each item is self-contained. Required and optional files:

```
src/playground/<slug>/
├── content.mdx       # Required — frontmatter + optional body
├── preview.tsx       # Preferred — renders the demo card/main view
└── components.ts     # Optional — barrel for MDX-injectable components
```

No cross-item imports. Item-specific utilities, hooks, and assets live inside the item's directory.

### Content Collections (`src/lib/`)

Per-section data loading modules. Each section exposes typed query functions:

- `getAllItems()` / `getItemBySlug()` — Playground
- Work and writing collections follow the same pattern with section-appropriate schemas

Content is loaded at build time from the filesystem; no runtime discovery.

### Shared Utilities (`src/lib/`)

- `cn.ts` — Class composition
- `types.ts` — Shared TypeScript types
- `speed-context.tsx` — Motion speed preference context

## Naming Conventions

- **Files**: kebab-case for all source files (`sticky-header.tsx`, `content.ts`)
- **Components**: PascalCase exports (`StickyHeader`, `Frame`)
- **Slugs**: kebab-case directory names (`floating-label-input`)
- **Route segments**: kebab-case (`/playground/[slug]`)

## Import Organization

```typescript
import { Component } from "@/components/component"; // Shell components
import { getAllItems } from "@/lib/content"; // Collection queries
import { cn } from "@/lib/cn"; // Utilities
import { LocalHelper } from "./helper"; // Item-local (relative)
```

**Path alias**: `@/` maps to `src/`

## Code Organization Principles

- **Self-containment**: Playground items never import from each other. Shared patterns are extracted to `src/components/` or `src/lib/` only when used by three or more items.
- **Server by default**: Components are React Server Components unless interactivity requires `"use client"`.
- **Section independence**: Each content section (playground, work, writing) is independently loadable. Adding a new section does not require modifying other sections' collection logic.
- **Isolation via lazy loading**: Preview components are dynamically imported with error boundaries so demo failures are local.
