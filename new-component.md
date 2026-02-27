# Adding a New Item

## Interactive Component

### 1. Create the component folder

```bash
mkdir src/playground/<slug>
```

### 2. Create `component.tsx`

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

### 3. Add to `src/data/items.ts`

```ts
{
  slug: "my-component",
  type: "interactive",
  title: "My Component",
  description: "Optional description.",
  createdAt: "2026-02-27",
  links: [{ label: "GitHub", href: "https://github.com/..." }], // optional
},
```

### 4. Done

The component renders inline on the home page, lazy-mounted via IntersectionObserver.

---

## Image or Video Item

Just add an entry to `src/data/items.ts`:

```ts
{
  slug: "my-project",
  type: "image", // or "video"
  title: "My Project",
  src: "/previews/my-project.png",
  createdAt: "2026-02-27",
  links: [{ label: "Live", href: "https://example.com" }],
},
```

Place assets in `public/previews/`.

---

## Preview Component (custom visual for non-interactive items)

### 1. Create `src/preview/<name>.tsx`

```tsx
"use client";

export default function MyPreview({ name }: { name: string }) {
  return <div>...</div>;
}
```

### 2. Add to `src/data/items.ts`

```ts
{
  slug: "my-project",
  type: "preview",
  name: "my-preview",
  title: "My Project",
  createdAt: "2026-02-27",
},
```

---

## Checklist

- [ ] Component slug matches folder name (for interactive) or is unique (for others)
- [ ] `component.tsx` has `"use client"` and a default export
- [ ] Entry added to `src/data/items.ts`
- [ ] `bun run dev` — item appears in feed
- [ ] `bun run build` — no errors
