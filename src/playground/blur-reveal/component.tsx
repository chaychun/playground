"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// Lightweight progressive blur — no portal, no overlay, fully inline
function ProgressiveBlur({
  direction = "bottom",
  layers = 6,
  intensity = 0.3,
  className,
}: {
  direction?: "top" | "bottom";
  layers?: number;
  intensity?: number;
  className?: string;
}) {
  const angle = direction === "bottom" ? 180 : 0;
  const segmentSize = 1 / (layers + 1);

  return (
    <div className={cn("pointer-events-none relative", className)}>
      {Array.from({ length: layers }).map((_, i) => {
        const stops = [
          i * segmentSize,
          (i + 1) * segmentSize,
          (i + 2) * segmentSize,
          (i + 3) * segmentSize,
        ].map((p, pi) => `rgba(255,255,255,${pi === 1 || pi === 2 ? 1 : 0}) ${p * 100}%`);
        const gradient = `linear-gradient(${angle}deg, ${stops.join(", ")})`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${i * intensity}px)`,
              WebkitBackdropFilter: `blur(${i * intensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

const ITEMS = [
  {
    label: "Spring dynamics",
    detail: "Natural motion via configurable stiffness, damping, and mass parameters",
  },
  {
    label: "Layout animations",
    detail: "Smooth transitions when DOM elements change size or position",
  },
  {
    label: "Gesture recognition",
    detail: "Pan, pinch, rotate, and swipe with momentum and inertia",
  },
  { label: "Scroll-linked", detail: "Progress-based animations tied to scroll position" },
  { label: "Exit animations", detail: "Graceful unmount transitions using AnimatePresence" },
];

export default function BlurReveal() {
  const [revealed, setRevealed] = useState(false);

  const toggle = useCallback(() => setRevealed((v) => !v), []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 p-5 pb-16">
        <p className="font-mono text-2xs tracking-widest text-muted uppercase">Motion Toolkit</p>
        <ul className="flex flex-col gap-2">
          {ITEMS.map((item, i) => (
            <li key={item.label}>
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <AnimatePresence>
                {revealed && (
                  <motion.p
                    className="text-xs text-muted"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        delay: i * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {item.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      {/* Blur gradient at bottom */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="absolute inset-x-0 bottom-0 h-32"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <ProgressiveBlur
              direction="bottom"
              layers={8}
              intensity={0.5}
              className="h-full w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
        <motion.button
          onClick={toggle}
          className="cursor-pointer rounded-full bg-ink px-4 py-2 text-xs font-medium text-ink-inv transition-colors hover:bg-dim"
          whileTap={{ scale: 0.95 }}
          layout
        >
          {revealed ? "Blur" : "Reveal"}
        </motion.button>
      </div>
    </div>
  );
}
