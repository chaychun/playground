---
name: animation-performance-tiers
description: Use when planning or implementing web animations — choosing which CSS properties to animate, selecting animation techniques (CSS, WAAPI, Motion, GSAP, scroll timeline), or deciding between transform, opacity, layout, and paint-triggering approaches. Also use when animating CSS variables, SVG attributes, or View Transitions.
---

# Animation Performance Tiers

Choose the right animation technique by understanding what the browser does with each property.

**Source:** Matt Perry, [The Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list)

## Render Pipeline

Each frame, browsers execute three steps in order:

| Step          | What it does                        | Triggered by                                                  | Cost    |
| ------------- | ----------------------------------- | ------------------------------------------------------------- | ------- |
| **Layout**    | Calculate geometry (size, position) | width, height, margin, top, display, flex, grid               | Highest |
| **Paint**     | Draw pixels into layers             | background-color, color, border-radius, box-shadow, gradients | Medium  |
| **Composite** | Merge layers, apply transforms      | transform, opacity, filter, clip-path                         | Lowest  |

Triggering an earlier step forces all subsequent steps. Layout triggers paint AND composite.

**Threads:** Layout and paint run on the **main thread** (shared with JS). Composite can run on the **compositor thread** (GPU). Compositor animations stay smooth even when JS is busy.

## Tier List

### S-Tier — Compositor thread (best possible)

Animate `transform`, `opacity`, `filter`, `clip-path` via CSS transitions/animations, WAAPI, or Motion. Runs on GPU, 60-120fps even under main thread load.

- Scroll/View Timeline animations are also S-Tier
- **Caveat — Safari:** de-optimises to main thread for unsupported features (e.g. `playbackRate` other than 1)
- **Caveat — GPU memory:** layer size can exhaust GPU on mobile — beware large/cloned elements (tickers, marquees)
- **Caveat — blur:** `filter: blur()` cost scales with radius times layer size — keep blur radius 8px or less

### A-Tier — Main thread, composite values

Same properties via JS (`element.style`, rAF, GSAP). Only triggers composite, but runs on main thread — interruptible by heavy JS.

- Element **must** be a layer first. Promotion triggers: CSS/WAAPI animation, 3D transform, `position: fixed/sticky`, `backdrop-filter`, `will-change`
- `will-change`: use sparingly — too many or too-large layers blow GPU memory
- WebGL/WebGPU shaders: fast render but rAF-scheduled (main thread timing)
- IntersectionObserver: ideal for triggering animations and deactivating off-screen ones (runs on background thread)

### B-Tier — Upfront measurement, then A/S-Tier

One-time DOM read, then animate with transform/opacity. The **FLIP technique** (First, Last, Invert, Play).

- Motion's `<motion.div layout />` does this automatically
- Turns D-Tier layout animation into a transform animation
- Manual FLIP on a single element with no scale correction can be S-Tier

### C-Tier — Triggers paint

Redraws affected layers every frame. Acceptable on small, isolated surfaces.

| Cheap paint                       | Expensive paint                            |
| --------------------------------- | ------------------------------------------ |
| `background-color`, `color`       | `mask-image`, `background-image` gradients |
| `border-radius` on small elements | Any paint property on large surfaces       |

- **CSS variables always trigger paint** — even when used inside compositor properties like `opacity`. This silently downgrades S-Tier animations to C-Tier.
- **SVG attributes** (`d`, `cx`, `cy`, `r`): repaint every frame. Prefer `transform` for move/resize.
- **View Transitions:** crossfade itself is S-Tier, but cannot interrupt mid-animation and width/height parts are D-Tier. Best for non-interactive navigation only.

### D-Tier — Triggers layout

Full pipeline every frame. Cost scales with tree size and complexity.

**Properties:** `width`, `height`, `margin`, `padding`, `border`, `top`/`left`/`right`/`bottom`, `display`, `flex`, `grid-template-*`, `justify-content`, `font-size`

**Mitigate:** `position: absolute/fixed` isolates from siblings. `contain: layout` scopes recalculation. FLIP technique avoids per-frame layout entirely.

### F-Tier — Thrashing and inheritance bombs (never do this)

**Thrashing:** interleaved DOM reads and writes force synchronous layout.

```js
// F-TIER: forces layout between each read
element.style.width = "100px"; // write
const w = element.offsetWidth; // read -> forced layout
element.style.width = w * 2 + "px"; // write again
```

**Fix:** batch all reads before all writes. Motion's `frame.read()` / `frame.update()` API handles this.

**CSS variable inheritance bomb:**

```css
/* Animating a global variable forces style recalc on ALL descendants
   even if they don't use the variable.
   Real case: 1300+ elements, 8ms/frame — entire 120fps budget */
html {
  --progress: 0;
}
```

**Fix:** scope variable locally, or use `@property` with `inherits: false`:

```css
@property --progress {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}
```

## Decision Guide

| Want to animate...                | Technique                                      | Tier |
| --------------------------------- | ---------------------------------------------- | ---- |
| Position, scale, rotation, fade   | `transform` + `opacity` via WAAPI/Motion       | S    |
| Same properties via JS/GSAP       | `transform` + `opacity` on promoted layer      | A    |
| Layout change (size or position)  | FLIP / Motion layout                           | B    |
| Color, appearance (small surface) | Direct property change                         | C    |
| Color, appearance (large surface) | Avoid — use opacity crossfade instead          | S    |
| Scroll-linked                     | Scroll/View Timeline API                       | S    |
| Scroll-linked via JS scrollTop    | **Avoid** — use timeline API instead           | D    |
| CSS variable animation            | `@property` + `inherits: false`, scope locally | C    |
| Global/inherited CSS variable     | **Never** — use targeted `element.style`       | F    |
| Page transition (non-interactive) | View Transitions                               | C    |
| Interactive layout transition     | Motion layout                                  | B    |

## Common Traps

1. **CSS variable in compositor property** — `opacity: var(--x)` is C-Tier, not S-Tier
2. **Missing layer promotion** — transform/opacity without a layer triggers paint, not composite
3. **Blur on large surfaces** — GPU-accelerated does not mean free; cost scales with area times radius
4. **Global CSS variable animation** — inheritance forces recalc on entire subtree even for unused variables
5. **scrollTop for scroll animation** — visibly lags behind actual scroll, especially in Safari
6. **View Transitions for interactive UI** — cannot interrupt, forces wait-or-jump behavior

## Related

Use `/fixing-motion-performance` to **review and audit** existing animation code against performance rules.
