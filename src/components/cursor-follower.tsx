"use client";

import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CursorState = {
  type: "internal" | "external";
  label: string;
};

const SPRING_CONFIG = { stiffness: 400, damping: 40, mass: 0.8 };

const Icons = {
  internal: <ArrowRightIcon weight="bold" size={12} />,
  external: <ArrowUpRightIcon weight="bold" size={12} />,
};

export function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<CursorState | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  // Initial values off-screen so they don't pop in
  const x = useSpring(-100, SPRING_CONFIG);
  const y = useSpring(-100, SPRING_CONFIG);
  const isActive = useRef(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      setIsTouch(true);
      return;
    }

    let hideTimeout: ReturnType<typeof setTimeout>;
    let activeTimeout: ReturnType<typeof setTimeout>;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isActive.current) return;
      // Offset cursor follower slightly so it doesn't block clicks and feels natural
      x.set(e.clientX + 16);
      y.set(e.clientY + 16);
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      // Find closest element with data-cursor
      const cursorTarget = target.closest("[data-cursor]");

      if (cursorTarget) {
        if (!isActive.current) {
          // Immediately jump to the new cursor position instead of flying in from the last known state
          if (x.jump && y.jump) {
            x.jump(e.clientX + 16);
            y.jump(e.clientY + 16);
          } else {
            x.set(e.clientX + 16);
            y.set(e.clientY + 16);
          }
        }
        isActive.current = true;
        clearTimeout(activeTimeout);

        const type = cursorTarget.getAttribute("data-cursor") as "internal" | "external";
        if (type === "internal") {
          setData((prev) =>
            prev?.type === "internal" ? prev : { type: "internal", label: "See Exploration" },
          );
          clearTimeout(hideTimeout);
          setIsVisible(true);
        } else if (type === "external") {
          setData((prev) =>
            prev?.type === "external" ? prev : { type: "external", label: "Visit" },
          );
          clearTimeout(hideTimeout);
          setIsVisible(true);
        }
      } else {
        clearTimeout(hideTimeout);
        clearTimeout(activeTimeout);

        // Delay hiding slightly to prevent flickering when crossing small gaps
        hideTimeout = setTimeout(() => setIsVisible(false), 50);

        // Delay disabling calculations so the exit animation (0.2s) has time to finish
        activeTimeout = setTimeout(() => {
          isActive.current = false;
        }, 300);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      clearTimeout(hideTimeout);
      clearTimeout(activeTimeout);
    };
  }, [x, y]);

  if (isTouch) return null;

  return (
    <AnimatePresence>
      {isVisible && data && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-[100] select-none"
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
          style={{ x, y }}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-paper shadow-md dark:shadow-none"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={data.label}
                className="font-sans text-sm font-medium whitespace-nowrap text-paper"
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
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={data.type}
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
                className="flex items-center justify-center text-paper"
              >
                {Icons[data.type]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
