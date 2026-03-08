# Page Stack Redesign

## Context

The current page-stack component renders blank cards with "Page N" labels. The stacking animation works well but the cards have no meaningful content. The goal is to redesign the cards to reflect a realistic use case: an architectural/interior design article with multiple card types (essay, media, list) and styled inline mention links inspired by the syne-refined project. The component should also move from inline (rendered in the grid) to a full-page preview component.

## Reference

- **Figma**: [Garden site — Stacked design](https://www.figma.com/design/hVS8BXU1lxLKOM56289aEf/Garden-site?node-id=13-10)
- **Mention links reference**: `/Users/chayut/projects/syne-refined/src/components/blocks/RichText.tsx`

## Files to Modify

| File                                      | Change                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `src/lib/types.ts`                        | Add optional `fullViewport?: boolean` to ComponentMeta                 |
| `src/app/playground/[slug]/page.tsx`      | Conditional full-viewport rendering when `fullViewport: true`          |
| `src/playground/page-stack/meta.ts`       | Switch to `display: "preview"`, add `fullViewport: true`               |
| `src/playground/page-stack/component.tsx` | Major rewrite: card content, mention links, remove add/remove controls |
| `src/components/grid/preview-cell.tsx`    | Render actual preview image/video (currently empty placeholder)        |

## Implementation Steps

### 1. Add `fullViewport` to types

In `src/lib/types.ts`, add `fullViewport?: boolean` to the base ComponentMeta type. Non-breaking, all existing metas stay valid.

### 2. Update `[slug]/page.tsx`

When `meta.fullViewport` is true, render the component without the header/padding wrapper — just `<main className="min-h-svh">` with the lazy component filling the viewport.

### 3. Update `meta.ts`

```ts
display: "preview",
preview: { type: "image", src: "/previews/page-stack.png" },
fullViewport: true,
```

Use a placeholder image initially; take a real screenshot after the component is done.

### 4. Rewrite `component.tsx`

**Remove:**

- `StackControls` component
- `numCards` state + add/remove handlers
- The "Page N" label inside cards

**Add — Card content types and data:**

- 4 hardcoded cards: essay (top), media, light list, dark list (bottom)
- Content themed as architecture/interior design
- Essay body uses mixed text + mention link segments

**Add — MentionLink component:**

- Inline span with Phosphor icon badge (colored background) + underlined text
- 5 mention types: place, person, concept, project, material
- Each with OKLCH-based colors (7% bg, 30% underline)
- Icons: MapPin, User, Lightbulb, Cube, Drop

**Add — Card renderers:**

- `NoteCardView` — category tag with dot, large title, rich body with mentions, serif-like headings
- `MediaCardView` — hero image, title, body text, optional image grid
- `ListCardView` — title, description, numbered items (01-05), selected item highlight, light/dark variants

**Modify — StackCard:**

- Accept `content: CardContent` prop instead of just `index`
- Render appropriate card view based on `content.kind`
- Background color driven by card type (paper for note/media, ink for dark list)
- Add `overflow-y-auto` for scrollable content in active card

**Modify — PageStack main:**

- Fixed card count from `CARDS.length` (no state)
- Map over `CARDS` instead of `Array.from`
- Container uses `min-h-svh` for full viewport
- Keep the counter badge as subtle page indicator

**Keep intact:**

- All position calculation functions (getPos, getStackPositions, getPeekOffsets)
- Animation/transition system
- Desktop hover-peek behavior
- Mobile drag-to-navigate (only on non-active peek card to avoid scroll conflict)

### 5. Fix preview-cell.tsx

Render the actual `item.preview` image/video in the grid cell instead of an empty div. Add hover scale effect on the image.

### 6. Handle mobile scroll vs drag conflict

Only the peeking next card (`activeIndex + 1`) should be draggable. The active card should scroll normally. Adjust `isDraggable` logic to exclude the active card on mobile.

## Card Content Summary

| Position   | Type         | Title                   | Theme                                                                            |
| ---------- | ------------ | ----------------------- | -------------------------------------------------------------------------------- |
| Top (3)    | Note/Essay   | "On Quiet Architecture" | Article about restrained design with mentions of Zumthor, Therme Vals, wabi-sabi |
| 2          | Media        | "The atrium at dusk"    | Architectural photography with Unsplash images                                   |
| 1          | List (light) | "Design Principles"     | Light as material, restrained ornamentation, etc.                                |
| Bottom (0) | List (dark)  | "Material Palette"      | Travertine, white oak, brushed brass, etc.                                       |

## Mention Link Design

Based on syne-refined's RichText component:

```
<span class="text-[0.8125rem] text-link mx-0.5">
  <span class="rounded-xs p-0.5 inline-flex items-center justify-center align-text-bottom"
        style="background-color: oklch(... / 0.07)">
    <Icon size={11} />
  </span>
  <span class="underline underline-offset-2"
        style="text-decoration-color: oklch(... / 0.3)">
    Name
  </span>
</span>
```

**Mention types and icons:**

- `place` → MapPin (hue 145, green)
- `person` → User (hue 30, warm)
- `concept` → Lightbulb (hue 280, purple)
- `project` → Cube (hue 60, yellow)
- `material` → Drop (hue 200, blue)

## Verification

1. Run `bun dev` and navigate to `/playground/page-stack`
2. Verify all 4 cards render with correct content
3. Test desktop: click to open/close cards, hover to peek
4. Test mobile (resize < 600px): drag to navigate between cards
5. Verify dark mode renders correctly
6. Verify the grid on `/` shows the preview cell with image
7. Run `bun run check` for lint/format
