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

See [docs/authoring.md](docs/authoring.md) for the full guide. Item loading is handled by `src/lib/content.ts`.
