"use client";

import { AnimatePresence, motion, useSpring, type MotionValue } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CursorVariant = "arrow" | "pointer" | "expand";

export interface HoverData {
  label: string;
  variant: CursorVariant;
  color: string;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const check = () => setIsDark(el.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

const DEFAULT_SPRING: SpringConfig = { stiffness: 500, damping: 60, mass: 0.8 };

export function useCursorFollower(config: SpringConfig = DEFAULT_SPRING) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<HoverData | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  const x = useSpring(0, config);
  const y = useSpring(0, config);

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
    clearTimeout(hideTimeout.current);
    setData({ label, variant, color });
    setIsVisible(true);
  }, []);

  const handleLeave = useCallback(() => {
    hideTimeout.current = setTimeout(() => setIsVisible(false), 120);
  }, []);

  useEffect(() => {
    return () => clearTimeout(hideTimeout.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => container.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return { containerRef, isVisible, data, x, y, handleEnter, handleLeave };
}

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

interface CursorTooltipProps {
  isVisible: boolean;
  data: HoverData | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function CursorTooltip({ isVisible, data, x, y }: CursorTooltipProps) {
  return (
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
  );
}
