# Playground

Personal portfolio & interactive component showcase. Vertical feed of interactive components, media items, and previews on the home page.

## Verification

Run `bun run check` before committing. Zero warnings, zero errors.

- `bun run check` — lint + format + typecheck
- `bun run build` — full Next.js build (for non-trivial changes)

Pre-commit hook enforces these checks automatically.

## Code Style

- `@/*` path alias for all imports from `src/`
- `cn()` from `@/lib/cn` for composing Tailwind classes
- Radix UI primitives for accessible interactive elements
- Semicolons required, double quotes
- Server components by default; `"use client"` only when needed
- Remove console.log/warn/error before committing

## Adding Items

Each item lives in `src/playground/<slug>/` with a `content.mdx` frontmatter file defining metadata (title, description, type, panelWidth, etc.). Interactive components go in `src/playground/<slug>/component.tsx` (`"use client"`, single default export). Preview components go in `src/preview/<name>.tsx`. Item loading is handled by `src/lib/content.ts`.

## Design

See [docs/design-context.md](docs/design-context.md) for design context, aesthetic direction, and principles.
