# About & Now Pages Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign about and now pages with the same always-dark editorial aesthetic as the desktop homepage.

**Architecture:** Extract the shared dark palette from home-page.tsx into a shared module. Move about/now pages into the `(home)` route group so they share layout. Update the `(home)` layout to use the dark background for all pages. Each page uses inline breadcrumb navigation on desktop. Mobile keeps existing header/footer but adapts to the dark palette.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Fraunces/DM Mono/Raleway fonts

---

### Task 1: Extract shared dark palette to `src/lib/palette.ts`

**Files:**

- Create: `src/lib/palette.ts`
- Modify: `src/components/home-page.tsx`

**Step 1: Create palette module**

Create `src/lib/palette.ts` with the `C` color constants currently hardcoded in `home-page.tsx`:

```ts
export const C = {
  bg: "#141416",
  text: "#C8C4BC",
  textSecondary: "rgba(200, 196, 188, 0.6)",
  textTertiary: "rgba(200, 196, 188, 0.5)",
  textFaint: "rgba(200, 196, 188, 0.35)",
  border: "rgba(200, 196, 188, 0.06)",
  activeBg: "rgba(200, 196, 188, 0.78)",
  activeFg: "#141416",
  activeFgSecondary: "rgba(20, 20, 22, 0.7)",
  activeFgTertiary: "rgba(20, 20, 22, 0.5)",
  accent: "#A6CDD2",
  accentSubtle: "rgba(166, 205, 210, 0.4)",
  accentHover: "rgba(166, 205, 210, 0.8)",
} as const;
```

**Step 2: Update home-page.tsx to import from palette**

In `src/components/home-page.tsx`:

- Remove the local `C` constant (lines 11-22)
- Add import: `import { C } from "@/lib/palette";`
- Update references to `#A6CDD2` and `rgba(166,205,210,...)` to use `C.accent`, `C.accentSubtle`, `C.accentHover`

**Step 3: Verify**

Run: `bun run check`
Expected: All pass, no behavior change.

**Step 4: Commit**

```
feat: extract dark palette to shared module
```

---

### Task 2: Update `(home)` layout for always-dark background

**Files:**

- Modify: `src/app/(home)/layout.tsx`

**Step 1: Update layout to use dark background**

Replace `bg-paper` with the hardcoded dark bg color. The layout needs to work for the homepage (which handles its own dark bg on desktop via inline styles) and the new about/now pages. On mobile, the MobileHeader and MobileFooter also need dark treatment.

```tsx
import { C } from "@/lib/palette";
import { MobileFooter } from "@/components/mobile-footer";
import { MobileHeader } from "@/components/mobile-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden"
      style={{ backgroundColor: C.bg }}
    >
      <MobileHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <MobileFooter />
    </div>
  );
}
```

Note: The MobileHeader and MobileFooter currently use semantic colors (bg-paper, text-ink, border-border, text-muted). They need to be updated to work with the dark background. This is handled in Task 3.

**Step 2: Verify**

Run: `bun run check`
Expected: All pass. Homepage should look the same.

**Step 3: Commit**

```
feat: update (home) layout with always-dark background
```

---

### Task 3: Update MobileHeader and MobileFooter for dark mode

**Files:**

- Modify: `src/components/mobile-header.tsx`
- Modify: `src/components/mobile-footer.tsx`

The mobile header/footer use semantic Tailwind classes (text-ink, bg-paper, border-border, text-muted). Since we're forcing dark mode, we need to either:

- (A) Use inline styles with the `C` palette, or
- (B) Keep semantic classes but ensure the dark theme is active

Since other pages (like design-system) may still use light mode and these components are shared, the simplest approach is to keep the existing semantic classes but ensure the `(home)` layout forces dark mode via the `dark` class. This way the CSS variables swap automatically.

**Step 1: Force dark class on (home) layout**

In `src/app/(home)/layout.tsx`, add `className="dark"` to the outer div (or a wrapping div). The semantic CSS variables in globals.css already define dark mode values under `.dark`. This means MobileHeader/MobileFooter will automatically get dark colors without any changes.

Actually, looking at globals.css, dark mode is via `.dark` class which swaps all CSS custom properties. So the cleanest approach:

```tsx
import { MobileFooter } from "@/components/mobile-footer";
import { MobileHeader } from "@/components/mobile-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark flex min-h-svh flex-col bg-paper lg:h-svh lg:overflow-hidden">
      <MobileHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <MobileFooter />
    </div>
  );
}
```

Wait — but the dark mode semantic colors (#141312 for paper) don't exactly match the home page's #141416. Close but not identical. Decision: use the semantic dark mode colors (`.dark` class) for consistency with the CSS variable system. The difference between #141312 and #141416 is imperceptible. This keeps things simpler and lets all semantic classes work automatically.

However, the homepage's `C` palette uses slightly different shades. For the about/now pages, using semantic dark mode classes is cleaner and more maintainable. The home page can keep its custom inline styles for the unique two-panel layout.

**Revised Step 1: Update (home) layout**

```tsx
import { MobileFooter } from "@/components/mobile-footer";
import { MobileHeader } from "@/components/mobile-header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark flex min-h-svh flex-col bg-paper lg:h-svh lg:overflow-hidden">
      <MobileHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <MobileFooter />
    </div>
  );
}
```

**Step 2: Remove ThemeToggle from MobileHeader**

Since the `(home)` group is always dark, the ThemeToggle is no longer useful. Remove it from MobileHeader. But wait — MobileHeader is shared and might be used by `(site)` layout too. Check: `(site)` layout also uses MobileHeader. If design-system page uses (site), we need to keep ThemeToggle working there.

For now, keep ThemeToggle in MobileHeader but it won't have visible effect inside `(home)` since `dark` class is forced. Can remove it later if (site) is deleted.

Actually, we should just hide the theme toggle when in the (home) layout. Simplest: accept a prop or use pathname check. But that's coupling. Simplest approach for now: keep it — the forced `dark` class means it cycles but has no visible effect. Not ideal UX but low priority.

**Step 3: Verify**

Run: `bun run check`
Dev server: check mobile header/footer render correctly in dark mode.

**Step 4: Commit**

```
feat: force dark mode on (home) layout
```

---

### Task 4: Create BreadcrumbNav component

**Files:**

- Create: `src/components/breadcrumb-nav.tsx`

**Step 1: Create the component**

```tsx
import { C } from "@/lib/palette";
import Link from "next/link";

export function BreadcrumbNav({ page }: { page: string }) {
  return (
    <nav
      className="hidden items-center gap-1.5 font-dm-mono text-[13px] tracking-[0.02em] lg:flex"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="transition-colors"
        style={{ color: C.text }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        chayut c.
      </Link>
      <span style={{ color: C.textFaint }}>/</span>
      <span style={{ color: C.textSecondary }}>{page}</span>
    </nav>
  );
}
```

Note: Use inline styles with `C` palette to match the home page's exact colors. Hidden on mobile (MobileHeader handles nav). The hover effect on "chayut c." uses JS handlers for the underline since we need inline style colors.

Actually, a cleaner approach using Tailwind's arbitrary values and the semantic dark mode classes (since we're inside `.dark`):

```tsx
import Link from "next/link";

export function BreadcrumbNav({ page }: { page: string }) {
  return (
    <nav
      className="hidden items-center gap-1.5 font-dm-mono text-[13px] tracking-[0.02em] lg:flex"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="text-ink underline-offset-2 transition-colors hover:underline hover:decoration-link"
      >
        chayut c.
      </Link>
      <span className="text-muted">/</span>
      <span className="text-dim">{page}</span>
    </nav>
  );
}
```

Since we're inside `.dark`, semantic colors (text-ink, text-muted, text-dim) resolve to the dark mode values. This is cleaner. Use this approach.

**Step 2: Verify**

Run: `bun run check`
Expected: All pass.

**Step 3: Commit**

```
feat: add BreadcrumbNav component
```

---

### Task 5: Redesign About page

**Files:**

- Create: `src/app/(home)/about/page.tsx`

**Step 1: Create the new about page**

Key design elements:

- BreadcrumbNav at top
- Page label: "ABOUT" — DM Mono, 10px, uppercase, muted
- Headline: Fraunces, extralight, 24px — "I'm Chayut, a design engineer based in Thailand."
- Body: 13px, dim (in dark mode = #a8a7a2)
- Photo: 120px mobile / 280px desktop, rounded-lg
- Social links: muted color, hover to ink
- Education section
- Cascade animations with cubic-bezier(0.16, 1, 0.3, 1)

Layout: On desktop, two columns (text ~60%, photo+social ~40%). On mobile, stacked (photo on top).

Use semantic Tailwind classes inside the `.dark` context from layout:

```tsx
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { type SocialLink, SOCIAL_LINKS } from "@/data/social";
import Image from "next/image";

const ABOUT_SOCIAL_LINKS: (SocialLink & { display: string })[] = [
  { ...SOCIAL_LINKS[0], display: "@chayutc_" },
  { ...SOCIAL_LINKS[1], display: "chaychun" },
  { ...SOCIAL_LINKS[2], display: "chun.chayut@gmail.com" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-6 lg:max-w-3xl lg:px-12 lg:py-10">
      <BreadcrumbNav page="about" />

      <div className="mt-6 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:gap-16">
        {/* Photo + Social (mobile: top, desktop: right via order) */}
        <div className="flex shrink-0 animate-in flex-row items-start gap-4 delay-[160ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:order-2 lg:flex-col lg:gap-0">
          <Image
            src="/images/profile.jpeg"
            alt="Chayut"
            width={280}
            height={280}
            className="aspect-square w-full max-w-[120px] rounded-lg object-cover lg:max-w-[280px]"
          />
          <div className="flex flex-col gap-2 lg:mt-4">
            {ABOUT_SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
              >
                <link.icon className="size-3.5 shrink-0" />
                <span>{link.display}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1 lg:order-1">
          <h1 className="animate-in font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
            About
          </h1>
          <h2 className="mt-3 animate-in font-serif text-xl font-extralight tracking-tight text-ink delay-[80ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:text-2xl">
            I&apos;m Chayut, a design engineer based in Thailand.
          </h2>

          <div className="mt-8 animate-in space-y-4 text-[13px] leading-relaxed text-dim delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
            <p>
              I design and build cool things with code, focusing on motion-led interactions and
              interface patterns that improve the experience of the user. I believe deeply in calm
              technology: tools that assists humans while remaining unintrusive. That&apos;s always
              the goal when I build anything.
            </p>
            <p>
              I work with both web (React) and Native (SwiftUI) platforms. My interest is more in
              the visible layer, not in the implementation, and I embrace AI coding tools in my
              workflow without compromising on quality.
            </p>
            <p>
              Outside of code, I&apos;m probably rearranging my room for the third time this month,
              deep in a rabbit hole about how people think and learn, or just enjoying a quiet
              moment with people I care about.
            </p>
          </div>

          {/* Education */}
          <section className="mt-16 animate-in delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
            <h2 className="font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase">
              Education
            </h2>
            <div className="mt-4">
              <p className="font-serif text-sm font-light text-ink">
                B.Sc. in Physics (First Class Honours)
              </p>
              <p className="mt-1 text-[13px] text-dim">Mahidol University International College</p>
              <p className="mt-0.5 font-dm-mono text-2xs text-muted">Graduated 2024</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

Key changes from original:

- Semantic font classes: `font-serif` (Fraunces), `font-dm-mono` (DM Mono), default body (Raleway)
- `font-extralight` / `font-light` for heading weights
- Breadcrumb at top instead of sidebar
- All semantic color classes work via `.dark` context from layout
- Max-width container centered (not sidebar-offset)

**Step 2: Verify**

Run: `bun run check`
Expected: All pass.

**Step 3: Commit**

```
feat: redesign about page with dark editorial aesthetic
```

---

### Task 6: Redesign Now page

**Files:**

- Create: `src/app/(home)/now/page.tsx`

**Step 1: Create the new now page**

```tsx
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import timelineData from "@/data/now-timeline.json";

type TimelineEntry = {
  title: string;
  body: string;
  tags?: string[];
};

type MonthEntry = {
  month: string;
  year: number;
  entries: TimelineEntry[];
};

export default function NowPage() {
  const data = timelineData as MonthEntry[];

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 lg:px-12 lg:py-10">
      <BreadcrumbNav page="now" />

      <div className="mt-6 max-w-xl lg:mt-10">
        <h1 className="animate-in font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
          Now
        </h1>
        <h2 className="mt-3 animate-in font-serif text-lg font-extralight tracking-tight text-ink delay-[60ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:text-xl">
          What I&apos;m doing, thinking about, and working on.
        </h2>
        <p className="mt-3 animate-in text-2xs text-muted delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
          This page is inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-link underline-offset-2 transition-colors hover:text-ink"
          >
            the /now movement
          </a>
          .
        </p>

        {/* Timeline */}
        <div className="relative mt-10">
          {data.map((month, index) => (
            <div
              key={`${month.month}-${month.year}`}
              className="relative animate-in pb-10 ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 last:pb-0"
              style={{ animationDelay: `${120 + index * 80}ms` }}
            >
              {/* Vertical line segment above the circle */}
              <div className="absolute top-0 left-[7px] h-[3px] w-px bg-border" />
              {/* Circle */}
              <div className="absolute top-[7px] left-0 z-10 size-[15px] rounded-full border-2 border-mid bg-paper" />
              {/* Vertical line segment below the circle */}
              <div className="absolute top-[26px] bottom-0 left-[7px] w-px bg-border" />

              {/* Month label */}
              <div className="pb-5 pl-[31px]">
                <span className="font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase">
                  {month.month} {month.year}
                </span>
              </div>

              {/* Entries */}
              <div className="ml-[31px] space-y-5">
                {month.entries.map((entry) => (
                  <div key={entry.title}>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="font-serif text-sm font-light text-ink">{entry.title}</h3>
                      {entry.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-surface px-2 py-0.5 font-dm-mono text-2xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-dim">{entry.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Key changes from original:

- BreadcrumbNav at top
- `font-serif` + `font-extralight` for headings (Fraunces)
- `font-dm-mono` for labels (DM Mono)
- `text-[13px]` body text instead of `text-sm`
- `font-serif text-sm font-light` for entry titles
- Timeline circles: `border-mid` instead of `border-ink` (subtler in dark mode)
- Max-width centered container
- No sidebar padding adjustments (no `lg:pr-8 lg:pl-0`)

**Step 2: Verify**

Run: `bun run check`
Expected: All pass.

**Step 3: Commit**

```
feat: redesign now page with dark editorial aesthetic
```

---

### Task 7: Clean up old `(site)` pages and verify

**Files:**

- Delete: `src/app/(site)/about/page.tsx`
- Delete: `src/app/(site)/now/page.tsx`
- Possibly delete: `src/app/(site)/layout.tsx`, `src/app/(site)/template.tsx` (if no other pages use them)

**Step 1: Check what else uses (site)**

The `(site)` route group currently has: layout.tsx, template.tsx, about/page.tsx, now/page.tsx. The design-system page is at `src/app/design-system/page.tsx` (outside both groups). If nothing else uses `(site)`, delete the entire group.

**Step 2: Delete old about and now pages**

```bash
rm src/app/\(site\)/about/page.tsx
rm src/app/\(site\)/now/page.tsx
rmdir src/app/\(site\)/about
rmdir src/app/\(site\)/now
```

**Step 3: Decide on (site) layout**

If no other pages exist under `(site)`, delete it entirely:

```bash
rm src/app/\(site\)/layout.tsx
rm src/app/\(site\)/template.tsx
rmdir src/app/\(site\)
```

If `(site)` is deleted, check if Sidebar/SidebarDefault/SidebarNav/SidebarFooter components are still used anywhere else. If not, consider leaving them (they're not hurting anything and might be useful later).

**Step 4: Verify**

Run: `bun run check`
Run: `bun run build`
Expected: All pass. No broken routes.

**Step 5: Commit**

```
chore: remove old (site) route group and about/now pages
```

---

### Task 8: Final verification and build

**Step 1: Run full check**

```bash
bun run check
```

**Step 2: Run build**

```bash
bun run build
```

**Step 3: Visual verification**

Start dev server and verify:

- Desktop homepage: unchanged, two-panel layout
- Desktop about page: dark bg, breadcrumb nav, serif headings, photo + social
- Desktop now page: dark bg, breadcrumb nav, timeline with dark styling
- Mobile all pages: dark bg, MobileHeader works, content readable
- All navigation links work (home -> about, home -> now, breadcrumb -> home)

**Step 4: Commit (if any fixes needed)**

```
fix: address visual issues from redesign
```
