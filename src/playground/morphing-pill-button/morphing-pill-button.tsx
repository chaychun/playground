"use client";

import { cn } from "@/lib/cn";
import { scaleTransition, useSpeed } from "@/lib/speed-context";
import { ArrowRight, Check, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ElementType } from "react";

type ButtonState = "idle" | "processing" | "done" | "failure";

const LABELS: Record<ButtonState, string> = {
  idle: "Submit",
  processing: "Checking",
  done: "Correct!",
  failure: "Incorrect",
};

// ─── Geometry ────────────────────────────────────────────────────────────────
// Button height is fixed at H = 40px (h-10).
// Border-radius: 9999px → effective end-cap radius = H/2 = 20px.
// The dot sits inside the right cap with a uniform inset margin M on all sides.
const H = 40; // h-10
const M = 5; // inset margin around the dot
const R = H / 2 - M; // dot radius = 15px → diameter = 30px
const DR = M; // dot right edge = 5px (= M)
const DT = M; // dot top  edge = 5px (= M)

// Gap between dot's left edge and the label text
const GAP = 10;
const TEXT_PL = 18; // left padding
const TEXT_PR = DR + R * 2 + GAP; // = 5 + 30 + 10 = 45px

// Clip-path using inset() so the shape is always pill-shaped, not circular.
// Idle  → full pill covering the button (slightly overflowing to hide border-radius vs clip-path seam).
// Dot   → small pill that equals a circle when width == height (= 2R = 30px).
//         left inset uses calc(100% − ...) so it works at any button width.
// Use exact computed radii instead of 9999px — Safari renders inset() with
// an oversized border-radius as a rectangle once the animation settles.
const CLIP_IDLE = `inset(1px 1px 1px 1px round ${H / 2 - 1}px)`;
const CLIP_DOT = `inset(${DT}px ${DR}px ${DT}px calc(100% - ${DR + R * 2}px) round ${R}px)`;

const EASE = [0.4, 0, 0.2, 1] as const;

const BG_COLOR: Record<ButtonState, string> = {
  idle: "var(--ink)",
  processing: "var(--ink)",
  done: "#10b981", // emerald-500
  failure: "#ef4444", // red-500
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StateIcon({ icon: Icon, size }: { icon: ElementType; size: number }) {
  const factor = useSpeed();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={scaleTransition({ duration: 0.2 }, factor)}
    >
      <Icon weight="bold" size={size} className="text-white" />
    </motion.div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MorphingPillButton({ className }: { className?: string }) {
  const factor = useSpeed();
  const [state, setState] = useState<ButtonState>("idle");
  const toggleRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = () => {
    if (state !== "idle") return;
    toggleRef.current = !toggleRef.current;
    const isDone = toggleRef.current;
    setState("processing");
    const t1 = setTimeout(() => {
      setState(isDone ? "done" : "failure");
      const t2 = setTimeout(() => setState("idle"), 2000 / factor);
      timers.current.push(t2);
    }, 3000 / factor);
    timers.current.push(t1);
  };

  const isIdle = state === "idle";

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={cn(
        "group relative flex h-10 cursor-pointer items-center overflow-hidden rounded-full font-semibold select-none",
        className,
      )}
      style={{ borderRadius: 9999 }}
      animate={state === "failure" ? { x: [0, -6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
      transition={scaleTransition(
        {
          layout: { duration: 0.25, ease: EASE },
          x: state === "failure" ? { duration: 0.4, ease: "easeInOut" } : { duration: 0.2 },
        },
        factor,
      )}
    >
      {/* White base */}
      <div className="absolute inset-0 rounded-full bg-surface ring-1 ring-border ring-inset" />

      {/* Ink fill — morphs between full pill (idle) and dot pill (other states).
          Color also transitions to green/red for done/failure. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          clipPath: isIdle ? CLIP_IDLE : CLIP_DOT,
          backgroundColor: BG_COLOR[state],
        }}
        transition={scaleTransition({ duration: 0.25, ease: EASE }, factor)}
      />

      {/* Ghost sizer — invisible, in-flow only when idle, holds the natural idle width */}
      {isIdle && (
        <div className="pointer-events-none invisible flex items-center gap-1.5 px-6" aria-hidden>
          <span>{LABELS.idle}</span>
          <ArrowRight weight="bold" size={15} />
        </div>
      )}

      {/* Idle text — absolute so it's never squished by layout changes, just clipped */}
      <AnimatePresence initial={false}>
        {isIdle && (
          <motion.div
            key="idle"
            className="absolute inset-0 z-10 flex items-center gap-1.5 px-6 text-ink-inv"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: scaleTransition({ delay: 0.1, duration: 0.15, ease: EASE }, factor),
            }}
            exit={{
              opacity: 0,
              filter: "blur(4px)",
              transition: scaleTransition({ duration: 0.1, ease: EASE }, factor),
            }}
          >
            <span>{LABELS.idle}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight weight="bold" size={15} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active content — in-flow, determines button width in active state */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!isIdle && (
          <motion.div
            key="active"
            layout
            className="relative z-10 flex items-center"
            style={{ paddingLeft: TEXT_PL, paddingRight: TEXT_PR }}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: scaleTransition({ delay: 0.1, duration: 0.15, ease: EASE }, factor),
            }}
            exit={{
              opacity: 0,
              filter: "blur(4px)",
              transition: scaleTransition({ duration: 0.1, ease: EASE }, factor),
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={state}
                layout
                className="whitespace-nowrap text-ink"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={scaleTransition({ duration: 0.15, ease: EASE }, factor)}
              >
                {LABELS[state]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dot indicator — centered inside the right cap, only in non-idle states */}
      <AnimatePresence>
        {!isIdle && (
          <motion.div
            key="indicator"
            className="pointer-events-none absolute z-20 flex items-center justify-center"
            style={{ right: DR, top: DT, width: R * 2, height: R * 2 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: scaleTransition({ delay: 0.1, duration: 0.15 }, factor),
            }}
            exit={{
              opacity: 0,
              transition: scaleTransition({ duration: 0.1 }, factor),
            }}
          >
            <AnimatePresence mode="popLayout">
              {state === "processing" && (
                <motion.div
                  key="dots"
                  className="flex items-center gap-[2.5px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={scaleTransition({ duration: 0.15 }, factor)}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="block h-[3px] w-[3px] rounded-full bg-ink-inv"
                      animate={{ y: [0, -3, 0] }}
                      transition={scaleTransition(
                        {
                          duration: 0.55,
                          repeat: Infinity,
                          delay: i * 0.12,
                          ease: "easeInOut",
                        },
                        factor,
                      )}
                    />
                  ))}
                </motion.div>
              )}
              {state === "done" && <StateIcon key="done" icon={Check} size={15} />}
              {state === "failure" && <StateIcon key="failure" icon={X} size={13} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
