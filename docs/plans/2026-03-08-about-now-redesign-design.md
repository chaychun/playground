# About & Now Pages Redesign

## Summary

Redesign the about and now pages to match the new desktop homepage's dark editorial aesthetic. Always-dark mode, no sidebar, inline breadcrumb navigation.

## Decisions

- **Always dark:** Hardcoded dark palette (#141416 bg, #C8C4BC text, #A6CDD2 accent). No theme toggle or system preference switching.
- **Drop sidebar:** Full-width single-column layout. No sidebar on desktop.
- **Inline breadcrumb:** `chayut c. / about` at top, DM Mono 13px. "chayut c." links to `/`. Hidden on mobile (MobileHeader handles nav).
- **Unified route group:** Move about/now into `(home)` group. Share layout with homepage.

## Design

### Shared Elements

**Palette (from home-page.tsx `C` object):**

- bg: `#141416`
- text: `#C8C4BC`
- textSecondary: `rgba(200, 196, 188, 0.6)`
- textTertiary: `rgba(200, 196, 188, 0.5)`
- textFaint: `rgba(200, 196, 188, 0.35)`
- border: `rgba(200, 196, 188, 0.06)`
- accent: `#A6CDD2`

**Typography:**

- Page label: DM Mono, 10px, uppercase, tracking 0.06em, textSecondary
- Headings: Fraunces, extralight, 24px (desktop) / 20px (mobile)
- Body: Raleway, 13px, light, textSecondary
- Subheadings: Fraunces, light, 16px, text
- Small labels: DM Mono, 10px, textFaint

**Breadcrumb (desktop only):**

- Position: top-left of content area
- Format: `chayut c. / about`
- Font: DM Mono, 13px, tracking 0.02em
- "chayut c." is a link (hover: accent underline)
- "/" separator in textFaint
- Current page name in textSecondary

**Links:** teal underline accent — `decoration-[rgba(166,205,210,0.4)]`, hover to `0.8` opacity.

**Animations:** Keep existing cascade pattern:

- cubic-bezier(0.16, 1, 0.3, 1) easing
- 550-800ms duration
- Staggered delays (40-200ms increments)

### About Page

- Page label: "ABOUT"
- Headline: "I'm Chayut, a design engineer based in Thailand." (Fraunces, extralight)
- Body paragraphs: Raleway, 13px, textSecondary
- Education section: DM Mono label + Raleway body
- Profile photo: rounded-lg, 120px mobile / 280px desktop
- Social links: textTertiary, hover to text, small icons

Layout: two-column on desktop (text left, photo+social right), stacked on mobile (photo above text).

### Now Page

- Page label: "NOW"
- Subtitle: Fraunces, extralight
- "/now movement" link: teal accent underline

Timeline:

- Vertical line: `C.border` color
- Dots: 15px circles, border in textTertiary, fill in C.bg
- Month labels: DM Mono, 10px, uppercase, textSecondary
- Entry titles: Fraunces, light, 16px, C.text
- Tags: pills with `rgba(200, 196, 188, 0.08)` bg, DM Mono 10px, textTertiary
- Body: Raleway, 13px, textSecondary

### Route Structure

Move `about/page.tsx` and `now/page.tsx` from `src/app/(site)/` to `src/app/(home)/`.

The `(home)` layout already has MobileHeader + MobileFooter. Desktop pages get the breadcrumb nav within their own page components (since home page doesn't need one).

The `(site)` route group can be removed if no other pages use it. Keep `design-system/page.tsx` at its current location outside both groups.

## Files to Change

1. `src/app/(home)/about/page.tsx` — new, redesigned about page
2. `src/app/(home)/now/page.tsx` — new, redesigned now page
3. `src/app/(home)/layout.tsx` — may need dark bg for all pages
4. `src/components/home-page.tsx` — extract `C` palette to shared location
5. `src/lib/palette.ts` — new, shared dark palette constants
6. `src/components/breadcrumb-nav.tsx` — new, inline breadcrumb component
7. `src/app/(site)/` — remove about/now pages (keep if design-system still uses it)
