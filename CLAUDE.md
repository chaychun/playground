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

All items defined in `src/data/items.ts`. Interactive components go in `src/playground/<slug>/component.tsx` (`"use client"`, single default export). Preview components go in `src/preview/<name>.tsx`.

## Design

See [docs/design-context.md](docs/design-context.md) for design context, aesthetic direction, and principles.
