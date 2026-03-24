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

  if (!time) return <div className="fc-root" />;

  return (
    <div className="fc-root">
      <style>{STYLES}</style>
      <div className="fc-display">
        <DigitPair value={time[0]} />
        <Colon />
        <DigitPair value={time[1]} />
        <Colon />
        <DigitPair value={time[2]} />
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
`;
