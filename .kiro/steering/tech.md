# Technology Stack

## Architecture

Next.js App Router with server components by default. Static generation at build time for all known routes. Content loaded server-side; interactive previews lazy-loaded client-side to isolate failures.

## Core Technologies

- **Language**: TypeScript (strict)
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Package Manager**: Bun (required — npm/npx/pnpm/yarn are blocked)
- **Styling**: Tailwind CSS v4 with custom theme tokens
- **Animation**: Motion.dev (primary), GSAP (complex sequences)
- **Primitives**: Radix UI for accessible interactive elements
- **Content**: next-mdx-remote (server RSC), gray-matter for frontmatter

## Key Libraries

- **`clsx` + `tailwind-merge`** via `cn()` — all conditional class composition
- **`@phosphor-icons/react`** — icon set
- **`next-themes`** — light/dark mode

## Development Standards

### Tooling

- **Linter/formatter**: oxlint + oxfmt (Rust-based, fast)
- **Check command**: `bun run check` — runs lint + format + typecheck; must pass with zero warnings/errors before committing
- **Build verification**: `bun run build` for non-trivial changes

### Code Style

- Semicolons required, double quotes
- `@/*` path alias for all imports from `src/`
- `cn()` from `@/lib/cn` for composing Tailwind classes
- Server components by default; `"use client"` only when required for interactivity
- No `console.log/warn/error` in committed code

### Common Commands

```bash
# Dev
bun dev

# Check (lint + format + typecheck)
bun run check

# Build
bun run build
```

## Key Technical Decisions

**Build-time content loading**: Content collections are scanned at build time via the filesystem. No CMS or runtime discovery. This keeps the site fully static and fast.

**Per-section content collections**: Each site section (playground, work, writing) has its own content loading module with its own frontmatter schema and query functions. A single monolithic collection mixing all content types is avoided — different content types have genuinely different shapes and requirements.

**Lazy preview loading**: Each playground component's `preview.tsx` is loaded via `next/dynamic` with an error boundary. One broken demo cannot affect the rest of the page.

**MDX compiled server-side**: `compileMDX` from `next-mdx-remote/rsc` runs at request time on the server. No client-side MDX runtime.
