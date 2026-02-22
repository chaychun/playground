# Adding a New Playground Component

## Steps

### 1. Create the folder

```bash
mkdir src/playground/<slug>
```

The folder name **is** the component ID and route slug. Use kebab-case (e.g. `spring-physics`, `color-mixer`).

### 2. Create `meta.ts`

```ts
import type { ComponentMeta } from "@/lib/types";

export const meta: ComponentMeta = {
  title: "My Component",
  orientation: "portrait", // "portrait" | "landscape"
  display: "inline", // "inline" | "preview"
  createdAt: "2026-02-22", // ISO date — determines grid sort order (newest first)
};
```

**If `display: "preview"`**, add the preview field:

```ts
export const meta: ComponentMeta = {
  title: "My Component",
  orientation: "landscape",
  display: "preview",
  createdAt: "2026-02-22",
  preview: { type: "image", src: "/previews/my-component.png" },
};
```

Place preview assets in `public/previews/`. Supports `"image"` or `"video"`.

### 3. Create `component.tsx`

```tsx
"use client";

export default function MyComponent() {
  return <div>...</div>;
}
```

Requirements:

- Must have `"use client"` directive
- Must have a single **default export**
- The component receives no props — it manages its own state

### 4. Done

No registration step. The filesystem scanner (`src/lib/get-playground-items.ts`) discovers the folder automatically at build time. The component will:

- Appear in the home grid (sorted by `createdAt`, newest first)
- Be available at `/playground/<slug>`

## Display Modes

| Mode        | Grid behavior                                                    | Route behavior                    |
| ----------- | ---------------------------------------------------------------- | --------------------------------- |
| `"inline"`  | Component renders live in the grid cell, immediately interactive | Full page at `/playground/<slug>` |
| `"preview"` | Shows preview image/video in grid, links to `/playground/<slug>` | Full page at `/playground/<slug>` |

## Orientation

| Value         | Grid effect               |
| ------------- | ------------------------- |
| `"portrait"`  | Tall cell (1 column span) |
| `"landscape"` | Wide cell (2 column span) |

## Folder Structure Reference

```
src/playground/<slug>/
├── meta.ts           # Required — ComponentMeta export
└── component.tsx     # Required — "use client", default export
```

## Checklist

- [ ] Folder name is kebab-case
- [ ] `meta.ts` exports `meta` with all required fields
- [ ] `component.tsx` has `"use client"` and a default export
- [ ] If `display: "preview"`, preview asset exists in `public/previews/`
- [ ] `bun run dev` — component appears in grid
- [ ] `bun run build` — no errors
