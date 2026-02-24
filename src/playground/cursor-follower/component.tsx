"use client";

import { cn } from "@/lib/cn";
import { ArrowSquareOut, Cursor, CursorClick, Plus } from "@phosphor-icons/react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CursorType = "external" | "interactive" | "default";

interface HoverData {
  title: string;
  type: CursorType;
}

const ZONES: { title: string; type: CursorType; desc: string }[] = [
  { title: "Repository", type: "external", desc: "Opens in new tab" },
  { title: "Live Demo", type: "interactive", desc: "Click to interact" },
  { title: "Archive", type: "default", desc: "Expand section" },
];

export default function CursorFollowerDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<HoverData | null>(null);

  const x = useSpring(0, { stiffness: 650, damping: 80, mass: 1.2 });
  const y = useSpring(0, { stiffness: 650, damping: 80, mass: 1.2 });

  const handlePointerMove = useMemo(() => {
    const offset = 16;
    return (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      x.set(e.clientX - rect.left + offset);
      y.set(e.clientY - rect.top + offset);
    };
  }, [x, y]);

  const handleEnter = useCallback((title: string, type: CursorType) => {
    setData({ title, type });
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

  const iconMap: Record<CursorType, React.ReactNode> = {
    external: <ArrowSquareOut className="h-3 w-3" weight="regular" />,
    interactive: <CursorClick className="h-3 w-3" weight="regular" />,
    default: <Plus className="h-3 w-3" weight="regular" />,
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full cursor-none flex-col justify-center gap-0 overflow-hidden bg-ink"
    >
      {ZONES.map((zone) => (
        <div
          key={zone.title}
          className="group flex flex-1 cursor-none items-center border-b border-ink-inv/10 px-8 transition-colors last:border-b-0 hover:bg-ink-inv/5"
          onMouseEnter={() => handleEnter(zone.title, zone.type)}
          onMouseLeave={handleLeave}
        >
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-lg font-medium text-ink-inv">{zone.title}</p>
              <p className="font-mono text-2xs text-muted">{zone.desc}</p>
            </div>
            <Cursor
              className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100"
              weight="thin"
            />
          </div>
        </div>
      ))}

      {/* Follower cursor */}
      <AnimatePresence>
        {isVisible && data && (
          <motion.div
            key="follower"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { delay: 0.15, duration: 0.3, ease: "easeOut" },
            }}
            className="pointer-events-none absolute top-0 left-0 z-50 select-none"
            style={{ x, y, position: "absolute" }}
          >
            <motion.div
              layout
              className={cn(
                "inline-flex items-center gap-1 overflow-hidden p-1 pr-2 shadow-sm backdrop-blur-md",
                "bg-paper/80 text-ink",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={data.type}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15, delay: 0.1 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  layout
                >
                  {iconMap[data.type]}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={data.title}
                  className="truncate font-mono text-2xs font-medium uppercase"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15, delay: 0.1 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  layout
                >
                  {data.title}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
