"use client";

import { AnimatePresence, motion, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CursorVariant = "arrow" | "pointer" | "expand";

interface HoverData {
  label: string;
  variant: CursorVariant;
  color: string;
}

const ZONES: {
  label: string;
  variant: CursorVariant;
  color: string;
  borderColor: string;
  bgHover: string;
}[] = [
  {
    label: "Link",
    variant: "arrow",
    color: "#d4634b",
    borderColor: "#d4634b",
    bgHover: "rgba(212, 99, 75, 0.06)",
  },
  {
    label: "Interactive",
    variant: "pointer",
    color: "#4a7fd4",
    borderColor: "#4a7fd4",
    bgHover: "rgba(74, 127, 212, 0.06)",
  },
  {
    label: "Expand Section",
    variant: "expand",
    color: "#4aab5e",
    borderColor: "#4aab5e",
    bgHover: "rgba(74, 171, 94, 0.06)",
  },
];

const VARIANT_ICONS: Record<CursorVariant, React.ReactNode> = {
  arrow: (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path
        d="M1 9L9 1M9 1H3M9 1V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pointer: (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path
        d="M5 1.5V8.5M1.5 5L5 1.5L8.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  expand: (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path d="M1 5H9M5 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function CursorFollowerDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<HoverData | null>(null);

  const x = useSpring(0, { stiffness: 500, damping: 60, mass: 0.8 });
  const y = useSpring(0, { stiffness: 500, damping: 60, mass: 0.8 });

  const handlePointerMove = useMemo(() => {
    const offset = 18;
    return (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      x.set(e.clientX - rect.left + offset);
      y.set(e.clientY - rect.top + offset);
    };
  }, [x, y]);

  const handleEnter = useCallback((label: string, variant: CursorVariant, color: string) => {
    setData({ label, variant, color });
    setIsVisible(true);
  }, []);

  const handleLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => container.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-hidden p-8"
      style={{ background: "#f7f6f3" }}
    >
      {/* Three colored dashed hover zones */}
      <div className="flex flex-1 flex-col">
        {ZONES.map((zone) => (
          <div
            key={zone.label}
            className="group relative flex flex-1 items-center justify-center transition-colors duration-200"
            style={{
              border: `1.5px dashed ${zone.borderColor}50`,
            }}
            onMouseEnter={() => handleEnter(zone.label, zone.variant, zone.color)}
            onMouseLeave={handleLeave}
          >
            {/* Hover fill */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: zone.bgHover }}
            />
            {/* Label */}
            <span
              className="relative font-mono text-2xs tracking-wider uppercase transition-opacity duration-200 select-none group-hover:opacity-80"
              style={{ color: zone.color, opacity: 0.4 }}
            >
              {zone.label}
            </span>
          </div>
        ))}
      </div>

      {/* Cursor follower tooltip */}
      <AnimatePresence>
        {isVisible && data && (
          <motion.div
            key="follower"
            initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              filter: "blur(2px)",
              transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
            }}
            className="pointer-events-none absolute top-0 left-0 z-50 select-none"
            style={{ x, y, position: "absolute" }}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: data.color,
                color: "#fff",
                boxShadow: `0 4px 16px ${data.color}40`,
              }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={data.variant}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.15, delay: 0.05 },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.1 },
                  }}
                  layout
                  className="flex items-center justify-center"
                >
                  {VARIANT_ICONS[data.variant]}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={data.label}
                  className="font-mono text-xs font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.15, delay: 0.05 },
                  }}
                  exit={{
                    opacity: 0,
                    x: 4,
                    transition: { duration: 0.1 },
                  }}
                  layout
                >
                  {data.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
