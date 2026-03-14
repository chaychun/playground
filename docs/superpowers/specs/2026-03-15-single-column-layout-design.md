# Single-Column Layout Redesign

Replace the split-panel layout with a centered single-column design. Editorial typography, inline interactive components, unified responsive layout.

## Approach

Clean slate layout replacement (Approach A). Delete split-panel machinery, replace with a simple centered column wrapper. The new layout is fundamentally simpler — no panel width management, no hover preview panel, no clip-path transitions.

## Layout Shell

The root `layout.tsx` (fonts, metadata, DialKit) is unchanged. The `(home)/layout.tsx` is stripped down to a centered column wrapper:

- **Max-width:** 680px, centered with `mx-auto`
- **Horizontal padding:** `px-6` on mobile
- **Breadcrumb:** `BreadcrumbNav` at top of column, fixed position (no repositioning needed since column width is constant). Same mono font styling, same animated slug, same back-navigation logic.
- No `PanelShell`, no `PreviewPanel`, no `ScrollEdgeBlur` usage (component kept for future reuse), no transition store.

The wrapper is essentially:
```tsx
<div className="mx-auto max-w-[680px] px-6">
  <BreadcrumbNav />
  {children}
</div>
```

## Typography Scale

Editorial sizing. Update CSS custom properties in `globals.css` and `mdx-components.tsx`.

| Element | Current | New |
|---------|---------|-----|
| Body text (Raleway) | 13px / 1.6 | 18px / 1.7 |
| h1 (Fraunces) | 24–32px (MDX) | 36–40px |
| h2 (Fraunces) | 18px | 28px |
| h3 (Fraunces) | 16px | 22px |
| Metadata/category (DM Mono) | 10px | 13px |
| Breadcrumb (DM Mono) | 10px | 13px |
| Captions (DM Mono) | — | 13px |
| Inline code | 13px | 16px |

Font families unchanged: Fraunces (serif, titles), Raleway (sans, body), DM Mono (mono, metadata).

Remove `max-w-lg` constraint on `<p>` in MDX components — the column itself (680px) governs reading width.

## Home Page

Single vertical feed of item blocks. One layout for all screen sizes — no mobile/desktop divergence.

### Intro Section
Name/headline and short blurb at the top, using the new larger type sizes.

### Item Block Structure
Each item in the feed:

1. **Preview image** — full column width, 16:10 aspect ratio, rounded corners. Uses existing `PreviewConfig` data (all fields: `src`, `fit`, `position`, `bg`, `interval`, `padding`).
2. **Title + Category row** — title (serif, left-aligned) and category (mono, uppercase, right-aligned) on the same baseline.
3. **Description** — body text below, muted color.

Generous vertical spacing between items. Entire block links to `/[slug]`.

### Animations
Keep `StaggerEntrance` for cascading entrance animation on the item list.

### Removed
- Dual mobile/desktop layouts (replaced by single responsive layout)
- `data-preview-slug` hover attributes
- Table header ("Name / Description / Type")
- Mobile "WIP notice"

### Kept
- `getAllItems()` and `getPreviewBySlug()` data loading
- Item sorting by `createdAt` descending
- Links to `/[slug]` detail pages

## Item Detail Page

Single-column article flow. No split layout with component on the left.

### Page Structure (top to bottom)
1. **Breadcrumb** — from layout wrapper
2. **Title** — h1, serif, 36–40px
3. **Meta row** — category + date, mono, muted
4. **MDX content** — article flow with inline components

### `<ComponentFrame>` — New MDX Component

Invisible sizing wrapper for inline interactive elements. No border, no background — just controls dimensions.

**Props:**
- **`size`** — `number`, fractional. `1` = 100% of column width (680px), `0.7` = 70% centered, `1.2` = breaks out of column via negative margins. Defaults to `1`.
- **`aspectRatio`** — optional `string` (e.g. `"16/10"`, `"4/3"`). If set, locks the aspect ratio. Must include proper parse error handling (invalid values fall back to no aspect ratio constraint).
- **`minHeight`** — optional `number` in px. Minimum height for loading/empty states.
- If neither `aspectRatio` nor `minHeight` is set, height is determined entirely by the component's content.

Sizing logic:
- `size <= 1`: `width: ${size * 100}%`, centered with `mx-auto`
- `size > 1`: calculated negative margins to break out of the 680px column

### `<Caption>` — New MDX Component

Separate block component for captions. Placed after a `ComponentFrame`, image, or any element by the author in MDX.

- Styled as: mono font, 13px, muted color
- Wraps MDX children, so markdown content inside is parsed automatically
- Visually distinct from body paragraphs

### Usage Example
```mdx
Some explanatory text above.

<ComponentFrame size={1.2} aspectRatio="4/3">
  <MeshDistortion />
</ComponentFrame>
<Caption>Drag to distort the mesh. Parameters are configurable via the panel below.</Caption>

More text continues below.
```

### Migration Strategy for Interactive Components

Currently, `type: "interactive"` items auto-render their `component.tsx` in the left panel via `[slug]/page.tsx`. After migration, the `[slug]/page.tsx` should auto-inject a `ComponentFrame` above the MDX content for `type: "interactive"` items — wrapping `LazyPlaygroundComponent` at default size (1) with no aspect ratio lock. This preserves the current behavior without requiring edits to every `content.mdx` file.

Authors can later move the component inline within their MDX for more control (e.g. placing it between specific paragraphs, adjusting size). But the auto-inject is the default.

For other item types (`content`, `preview`, `image`, `video`): these render MDX content only with no auto-injected component. Their detail pages are just article flow.

### `ComponentFrame` and `Caption` MDX Registration

Both `ComponentFrame` and `Caption` must be added to the `mdxComponents` map in `mdx-components.tsx` so they are available inside `.mdx` files. Import paths:
- `ComponentFrame` from `@/components/component-frame`
- `Caption` from `@/components/caption`

### Removed
- Left-panel component rendering
- Type-based layout branching for layout structure (the `type` field still exists on items and is used for auto-inject logic above)

### Kept
- `LazyPlaygroundComponent` (reused inside `ComponentFrame` for lazy loading + error boundary)
- All playground items and their `component.tsx` / `content.mdx` / `preview.ts` files

## Components Deleted

| Component | Reason |
|-----------|--------|
| `panel-shell.tsx` | Split-panel layout controller, no longer needed |
| `preview-panel.tsx` | Hover preview panel, replaced by inline previews |
| `panel-transition-overlay.tsx` | Clip-path page transition, removed |
| `transition-store.ts` | Pub-sub for preview state, no consumers |

## Components Kept (Not Used)

| Component | Reason |
|-----------|--------|
| `scroll-edge-blur.tsx` | May be reused later, not wired into new layout |

## Components Modified

| Component | Change |
|-----------|--------|
| `(home)/layout.tsx` | Strip to centered column wrapper |
| `(home)/page.tsx` | Single vertical feed, remove dual layouts |
| `(home)/[slug]/page.tsx` | Article flow, remove split-panel logic, auto-inject `ComponentFrame` for interactive items |
| `(home)/about/page.tsx` | Remove `lg:ml-[var(--panel-split)]` positioning, use column layout |
| `(home)/now/page.tsx` | Remove `lg:ml-[var(--panel-split)]` positioning, use column layout |
| `mdx-components.tsx` | Update typography sizes, remove `max-w-lg`, register `ComponentFrame` and `Caption` |
| `breadcrumb-nav.tsx` | Simplify positioning (no more dynamic panel offset) |
| `globals.css` | Update `--text-*` custom properties to new scale; remove `@property --panel-pct`, `@property --panel-inset`, and `.panel-transition` rules |

## New Components

| Component | Purpose |
|-----------|---------|
| `ComponentFrame` | Invisible sizing wrapper for inline interactive elements in MDX |
| `Caption` | Styled mono paragraph for captions in MDX |

## Design Tokens Unchanged

- Color palette: `--paper`, `--surface`, `--border`, `--mid`, `--muted`, `--link`, `--dim`, `--ink`, `--accent` (#a6cdd2)
- Font families: Fraunces, Raleway, DM Mono
- Animation easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Dark theme (exclusive)
