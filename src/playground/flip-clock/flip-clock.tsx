"use client";

import { cn } from "@/lib/cn";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Flip Digit ──────────────────────────────────────────────────────────────
// Four layers per digit, always rendered (no conditional DOM insertion):
//   1. fc-upper  (z:1) — static, shows new digit
//   2. fc-lower  (z:1) — static, shows old digit during flip, new after
//   3. fc-flap-top (z:2) — animates: old digit top folds away
//   4. fc-flap-bot (z:2) — animates: new digit bottom folds into place
// When idle the flaps sit on top of the static cards with identical appearance.
// Animation is triggered by adding .fc-flipping to the container.

function FlipDigit({ digit }: { digit: number }) {
  const [current, setCurrent] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setPrev(current);
      setCurrent(digit);
      setFlipping(true);
    }
  }, [digit, current]);

  const onAnimEnd = useCallback(() => {
    setFlipping(false);
  }, []);

  return (
    <div className={cn("fc-digit", flipping && "fc-flipping")}>
      <div className="fc-upper">
        <span>{current}</span>
      </div>
      <div className="fc-lower">
        <span>{flipping ? prev : current}</span>
      </div>
      <div className="fc-flap-top">
        <span>{flipping ? prev : current}</span>
      </div>
      <div className="fc-flap-bot" onAnimationEnd={onAnimEnd}>
        <span>{current}</span>
      </div>
      <div className="fc-fold" />
    </div>
  );
}

// ─── Digit Pair ──────────────────────────────────────────────────────────────

function DigitPair({ value }: { value: number }) {
  return (
    <div className="fc-pair">
      <FlipDigit digit={Math.floor(value / 10)} />
      <FlipDigit digit={value % 10} />
    </div>
  );
}

// ─── Colon Separator ─────────────────────────────────────────────────────────

function Colon() {
  return (
    <div className="fc-colon">
      <div className="fc-dot" />
      <div className="fc-dot" />
    </div>
  );
}

// ─── Clock ───────────────────────────────────────────────────────────────────

export default function FlipClock() {
  const [time, setTime] = useState<[number, number, number] | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime([now.getHours(), now.getMinutes(), now.getSeconds()]);
      timerRef.current = setTimeout(tick, 1000 - now.getMilliseconds() + 16);
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="fc-frame">
      <style>{STYLES}</style>
      <div className="fc-body">
        <div className="fc-screw fc-screw-tl" />
        <div className="fc-screw fc-screw-tr" />
        <div className="fc-screw fc-screw-bl" />
        <div className="fc-screw fc-screw-br" />
        <div className="fc-body-top">
          <div className="fc-brand">
            <span className="fc-brand-dot" />
            <span className="fc-brand-name">FC · 1</span>
          </div>
          <div className="fc-indicators">
            <span className="fc-ind" />
            <span className="fc-ind fc-ind-on" />
          </div>
        </div>
        <div className="fc-cavity">
          <div className="fc-root">
            {time !== null && (
              <div className="fc-display">
                <DigitPair value={time[0]} />
                <Colon />
                <DigitPair value={time[1]} />
                <Colon />
                <DigitPair value={time[2]} />
              </div>
            )}
          </div>
        </div>
        <div className="fc-body-bottom">
          <span>Flip Clock</span>
          <span>Model 1</span>
        </div>
        <div className="fc-foot fc-foot-l" />
        <div className="fc-foot fc-foot-r" />
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const STYLES = /* css */ `
.fc-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: clamp(40px, 8vw, 88px);
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: #f0f0ec;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

.fc-display {
  display: flex;
  align-items: center;
  gap: 0.18em;
}

.fc-pair {
  display: flex;
  gap: 0.09em;
}

/* ── Digit card ── */

.fc-digit {
  position: relative;
  width: 0.72em;
  height: 1.15em;
}

/* Shared half-card base */
.fc-upper,
.fc-lower,
.fc-flap-top,
.fc-flap-bot {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
}

/* Upper halves */
.fc-upper,
.fc-flap-top {
  top: 0;
  border-radius: 0.06em 0.06em 0 0;
  background: linear-gradient(180deg, #1d1d23, #16161a);
}

/* Lower halves */
.fc-lower,
.fc-flap-bot {
  bottom: 0;
  border-radius: 0 0 0.06em 0.06em;
  background: linear-gradient(180deg, #131317, #19191f);
}

/* Text: centered in a full-height flex box, clipped by the half-card */
.fc-upper span,
.fc-flap-top span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.15em;
}

.fc-lower span,
.fc-flap-bot span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.15em;
  transform: translateY(-50%);
}

/* ── Z-index stack ── */

.fc-upper    { z-index: 1; }
.fc-lower    { z-index: 1; }
.fc-flap-top { z-index: 2; }
.fc-flap-bot { z-index: 2; }

/* ── Fold line ── */

.fc-fold {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
  transform: translateY(-50%);
}

/* ── Flap animations ──
   Only active when .fc-flipping is on the container.
   perspective() lives in the keyframes so non-animated elements are never
   affected by 3D compositing. */

.fc-flipping .fc-flap-top {
  transform-origin: bottom center;
  animation: fc-flip-top 320ms cubic-bezier(0.32, 0, 0.85, 0.35) forwards;
}

.fc-flipping .fc-flap-bot {
  transform-origin: top center;
  animation: fc-flip-bot 280ms cubic-bezier(0.15, 0.65, 0.38, 1) 320ms both;
}

@keyframes fc-flip-top {
  from { transform: perspective(5em) rotateX(0deg); }
  to   { transform: perspective(5em) rotateX(-90deg); }
}

@keyframes fc-flip-bot {
  from { transform: perspective(5em) rotateX(90deg); }
  to   { transform: perspective(5em) rotateX(0deg); }
}

/* ── Colon separator ── */

.fc-colon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.22em;
  padding: 0 0.02em;
}

.fc-dot {
  width: 0.09em;
  height: 0.09em;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
}

/* ── Reduced motion ── */

@media (prefers-reduced-motion: reduce) {
  .fc-flipping .fc-flap-top,
  .fc-flipping .fc-flap-bot {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}

/* ─── Frame ─────────────────────────────────────────────────────────────────── */

/* Warm ambient environment — a desk surface */
.fc-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: oklch(83% 0.022 72);
  background-image:
    radial-gradient(ellipse 80% 60% at 28% 20%, oklch(90% 0.016 79 / 0.75) 0%, transparent 65%),
    radial-gradient(ellipse 55% 45% at 78% 88%, oklch(71% 0.03 64 / 0.35) 0%, transparent 60%);
}

/* ── Physical housing ── */

.fc-body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(100% - 40px, 560px);

  /* Warm cream ABS plastic — light from top-left */
  background: linear-gradient(
    158deg,
    oklch(96.5% 0.01 84) 0%,
    oklch(94% 0.013 81) 42%,
    oklch(91% 0.016 78) 100%
  );

  border-radius: 10px;
  padding: 20px 28px 22px;

  /* Beveled edges — top/left bright, right/bottom dark */
  border-top:    1.5px solid oklch(98%   0.005 86);
  border-left:   1.5px solid oklch(97%   0.008 84);
  border-right:  1px   solid oklch(81%   0.022 75);
  border-bottom: 1.5px solid oklch(73%   0.026 71);

  /* Cast shadows: contact, mid, ambient */
  box-shadow:
    0 2px  4px  oklch(38% 0.026 68 / 0.10),
    0 8px  20px oklch(32% 0.030 67 / 0.22),
    0 24px 56px oklch(28% 0.028 66 / 0.18),
    0 44px 80px oklch(25% 0.024 64 / 0.11);
}

/* Subtle plastic surface grain via SVG noise */
.fc-body::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  z-index: 10;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 150px 150px;
  opacity: 0.028;
  mix-blend-mode: multiply;
}

/* ── Phillips screws ── */

.fc-screw {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 36% 33%,
    oklch(93%  0.01 82) 0%,
    oklch(84%  0.018 78) 42%,
    oklch(70%  0.022 73) 78%,
    oklch(60%  0.026 70) 100%
  );
  box-shadow:
    0 1px 2px oklch(28% 0.03 66 / 0.38),
    inset 0 0.5px 0 oklch(97% 0.006 85 / 0.55);
  z-index: 5;
}

/* Phillips crosshair */
.fc-screw::before,
.fc-screw::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  background: oklch(42% 0.022 72 / 0.48);
  border-radius: 1px;
}
.fc-screw::before { width: 55%;   height: 1.5px; }
.fc-screw::after  { width: 1.5px; height: 55%;   }

.fc-screw-tl { top: 10px;    left: 10px;  }
.fc-screw-tr { top: 10px;    right: 10px; }
.fc-screw-bl { bottom: 13px; left: 10px;  }
.fc-screw-br { bottom: 13px; right: 10px; }

/* ── Top strip: brand + LED indicators ── */

.fc-body-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  position: relative;
  z-index: 1;
}

.fc-brand {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: oklch(43% 0.02 76);
}

.fc-brand-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 38% 35%,
    oklch(68% 0.022 78),
    oklch(52% 0.026 74)
  );
  box-shadow:
    0 1px 1px oklch(28% 0.03 66 / 0.3),
    inset 0 0.5px 0 oklch(75% 0.016 80 / 0.5);
  flex-shrink: 0;
}

/* LED indicator dots */
.fc-indicators {
  display: flex;
  align-items: center;
  gap: 5px;
}

.fc-ind {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 38% 35%,
    oklch(80% 0.018 78),
    oklch(66% 0.022 74)
  );
  box-shadow:
    0 1px 1px oklch(28% 0.03 66 / 0.25),
    inset 0 0.5px 0 oklch(88% 0.012 80 / 0.4);
}

/* Green "power on" LED */
.fc-ind-on {
  background: radial-gradient(
    circle at 38% 32%,
    oklch(78% 0.18 148),
    oklch(58% 0.20 143)
  );
  box-shadow:
    0 1px 1px oklch(28% 0.03 66 / 0.3),
    inset 0 0.5px 0 oklch(82% 0.15 148 / 0.6),
    0 0 5px oklch(60% 0.20 143 / 0.5),
    0 0 12px oklch(60% 0.20 143 / 0.2);
}

/* ── Display cavity ── */

.fc-cavity {
  background: oklch(10.5% 0.012 262);
  border-radius: 5px;
  padding: 16px 8px 18px;

  /* The opening in the plastic housing */
  border: 1px solid oklch(7% 0.01 260);

  /* Deep recess — top edge shadow strongest (light from above) */
  box-shadow:
    inset 0 3px 8px  oklch(0% 0 0 / 0.65),
    inset 0 6px 18px oklch(0% 0 0 / 0.42),
    inset 2px  0 6px oklch(0% 0 0 / 0.22),
    inset -2px 0 6px oklch(0% 0 0 / 0.22),
    inset 0 -1px 4px oklch(0% 0 0 / 0.18),
    /* Warm reflected rim from plastic */
    0 0 0 1px oklch(88% 0.016 80 / 0.1);

  /* Hold space before time loads */
  min-height: 84px;
}

/* Override root height and font-size inside frame */
.fc-cavity .fc-root {
  height: auto;
  font-size: clamp(24px, 4vw, 48px);
}

/* Slightly more visible colon dots in the dark cavity */
.fc-cavity .fc-dot {
  opacity: 0.45;
}

/* ── Bottom strip: product label ── */

.fc-body-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  position: relative;
  z-index: 1;

  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 7.5px;
  font-weight: 400;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: oklch(53% 0.018 76);
}

/* Engraved separator line */
.fc-body-bottom::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 22px;
  right: 22px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    oklch(80% 0.020 76 / 0.55) 15%,
    oklch(80% 0.020 76 / 0.55) 85%,
    transparent 100%
  );
}

/* ── Rubber feet ── */

.fc-foot {
  position: absolute;
  bottom: -5px;
  width: 30px;
  height: 6px;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(180deg, oklch(22% 0.01 68), oklch(14% 0.01 68));
  box-shadow: 0 2px 5px oklch(20% 0.02 68 / 0.48);
}

.fc-foot-l { left: 22px;  }
.fc-foot-r { right: 22px; }
`;
