/*
 * Tuned values — adjust via DialKit ("Sticky Header" panel) then apply here.
 *
 * DialKit setup: useDialKit lives in a "use client" component.
 * DialRoot is rendered via dynamic() + ssr:false in src/components/dev-tools.tsx.
 * Never use require("dialkit") in a server component — it won't hydrate.
 */
const PARAMS = {
  blur: {
    layers: 8,
    intensity: 0.6,
    height: 100,
    overhang: 48,
  },
  fade: {
    solidEnd: 15,
    p1pos: 44,
    p1opacity: 0.83,
    p2pos: 66,
    p2opacity: 0.52,
    p3pos: 83,
    p3opacity: 0.19,
  },
  layout: {
    paddingTop: 40,
    paddingBottom: 4,
  },
};

/** Catmull-Rom spline through sorted control points — smooth curve that passes through every point */
function smoothFade(pct: number, points: { pos: number; opacity: number }[]): number {
  let idx = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (pct <= points[i + 1].pos) {
      idx = i;
      break;
    }
    if (i === points.length - 2) idx = i;
  }

  const seg = points[idx + 1].pos - points[idx].pos;
  if (seg <= 0) return points[idx].opacity;
  const t = Math.min(1, Math.max(0, (pct - points[idx].pos) / seg));

  const p0 = points[Math.max(0, idx - 1)].opacity;
  const p1 = points[idx].opacity;
  const p2 = points[idx + 1].opacity;
  const p3 = points[Math.min(points.length - 1, idx + 2)].opacity;

  const t2 = t * t;
  const t3 = t2 * t;

  const v =
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3);

  return Math.min(1, Math.max(0, v));
}

/** Build sorted control points array from fade params */
function buildFadePoints(fade: typeof PARAMS.fade) {
  return [
    { pos: 0, opacity: 1 },
    { pos: fade.solidEnd, opacity: 1 },
    { pos: fade.p1pos, opacity: fade.p1opacity },
    { pos: fade.p2pos, opacity: fade.p2opacity },
    { pos: fade.p3pos, opacity: fade.p3opacity },
    { pos: 100, opacity: 0 },
  ].toSorted((a, b) => a.pos - b.pos);
}

/** Generate a smooth CSS mask-image gradient by sampling the spline at many stops */
function buildSmoothMask(fade: typeof PARAMS.fade, steps = 24) {
  const points = buildFadePoints(fade);
  const stops: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const pct = (i / steps) * 100;
    const opacity = smoothFade(pct, points);
    stops.push(`rgb(0 0 0 / ${(opacity * 100).toFixed(1)}%) ${pct.toFixed(1)}%`);
  }

  return `linear-gradient(180deg, ${stops.join(", ")})`;
}

export function StickyHeader({ children }: { children: React.ReactNode }) {
  const layers = Math.max(PARAMS.blur.layers, 2);
  const segmentSize = 1 / (layers + 1);

  const fadeMask = buildSmoothMask(PARAMS.fade);

  return (
    <div className="sticky top-0 z-50 print:hidden">
      {/* Blur + fade overlay */}
      <div
        className="pointer-events-none absolute top-0"
        style={{
          height: PARAMS.blur.height,
          left: -PARAMS.blur.overhang,
          right: -PARAMS.blur.overhang,
        }}
        aria-hidden="true"
      >
        {/* Color fade: paper → transparent */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--paper)",
            maskImage: fadeMask,
            WebkitMaskImage: fadeMask,
          }}
        />
        {/* Progressive blur layers — strongest at top, fading to none at bottom */}
        {Array.from({ length: layers }, (_, i) => {
          const stops = [
            i * segmentSize,
            (i + 1) * segmentSize,
            (i + 2) * segmentSize,
            (i + 3) * segmentSize,
          ]
            .map((pos, pi) => `rgba(255,255,255,${pi === 1 || pi === 2 ? 1 : 0}) ${pos * 100}%`)
            .join(", ");
          const mask = `linear-gradient(0deg, ${stops})`;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                maskImage: mask,
                WebkitMaskImage: mask,
                backdropFilter: `blur(${i * PARAMS.blur.intensity}px)`,
                WebkitBackdropFilter: `blur(${i * PARAMS.blur.intensity}px)`,
              }}
            />
          );
        })}
      </div>
      {/* Content */}
      <div
        className="relative"
        style={{
          paddingTop: PARAMS.layout.paddingTop,
          paddingBottom: PARAMS.layout.paddingBottom,
        }}
      >
        {children}
      </div>
    </div>
  );
}
