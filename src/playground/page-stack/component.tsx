"use client";

import { cn } from "@/lib/cn";
import { Minus, Plus } from "@phosphor-icons/react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

// --- Position calculation ---

const STACK_INCREMENT = 30;
const CLOSED_APPROACHING = [20, 0];
const OPEN_APPROACHING = [80, 40, 20, 10, 0];
const COLLAPSED_APPROACHING = [180, 90, 30, 0];
const PEEK_LEFT = -20;
const PEEK_RIGHT = [20, 30, 40, 50, 60];
const MAX_OPEN = 5;
const MAX_CLOSED = 2;
const MAX_COLLAPSED = 4;

function calcApproach(idx: number, total: number, isOpen: boolean, collapsed = false): number {
  const offsets = collapsed
    ? COLLAPSED_APPROACHING
    : isOpen
      ? OPEN_APPROACHING
      : CLOSED_APPROACHING;
  const count = collapsed ? idx : isOpen ? total - idx - 1 : idx;
  return offsets[Math.min(count, offsets.length - 1)];
}

function calcIncrement(idx: number, total: number, isOpen: boolean, collapsed = false): number {
  let mult: number;
  if (collapsed) {
    mult = MAX_COLLAPSED - idx;
  } else if (isOpen) {
    mult = total <= MAX_OPEN ? idx : Math.max(0, MAX_OPEN - total + idx);
  } else {
    mult = MAX_CLOSED <= 0 ? -1 - idx : MAX_CLOSED - idx;
  }
  return mult * STACK_INCREMENT;
}

function getPos(
  idx: number,
  total: number,
  isOpen: boolean,
  vw: number,
  collapsed = false,
): number {
  const eff = collapsed ? false : isOpen;
  if (!collapsed && isOpen && total > MAX_OPEN && idx < total - MAX_OPEN + 1) {
    return vw * 0.2;
  }
  const ao = calcApproach(idx, total, eff, collapsed);
  const inc = calcIncrement(idx, total, eff, collapsed);
  return !collapsed && isOpen ? vw * 0.2 + ao + inc : vw - ao - inc;
}

function getStackPositions(active: number, total: number, vw: number): number[] {
  const pos = Array.from<number>({ length: total }).fill(0);
  if (active === -1) {
    for (let i = 0; i < total; i++) pos[i] = getPos(i, total, false, vw, true);
  } else {
    for (let i = 0; i <= active; i++) pos[i] = getPos(i, active + 1, true, vw);
    const closed = total - active - 1;
    for (let i = 0; i < closed; i++) pos[active + 1 + i] = getPos(i, closed, false, vw);
  }
  return pos;
}

function getPeekOffsets(hovered: number | null, active: number, total: number): number[] {
  const offsets = Array.from<number>({ length: total }).fill(0);
  if (hovered === null || hovered === active) return offsets;
  if (hovered > active) {
    offsets[hovered] = PEEK_LEFT;
  } else {
    for (let i = active; i > hovered; i--) offsets[i] = PEEK_RIGHT[active - i] ?? 0;
  }
  return offsets;
}

// --- Card ---

function StackCard({
  pos,
  isHorizontal,
  index,
  isActive,
  isDraggable,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onRequestClose,
  onRequestOpen,
  isReady,
  transitionDelay = 0,
}: {
  pos: number;
  isHorizontal: boolean;
  index: number;
  isActive: boolean;
  isDraggable: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onRequestClose?: () => void;
  onRequestOpen?: () => void;
  isReady: boolean;
  transitionDelay?: number;
}) {
  const [scope, animate] = useAnimate();
  const hasClose = typeof onRequestClose === "function";
  const hasOpen = typeof onRequestOpen === "function";

  const dragProps =
    !isHorizontal && isDraggable && (hasClose || hasOpen)
      ? {
          drag: "y" as const,
          dragMomentum: false,
          dragSnapToOrigin: false,
          ...(hasClose && !hasOpen ? { dragConstraints: { top: 0 } } : {}),
          dragElastic: 0,
          onDragEnd: (
            _e: PointerEvent | MouseEvent | TouchEvent,
            info: { offset: { x: number; y: number } },
          ) => {
            if (hasClose && info.offset.y > 120) {
              onRequestClose?.();
              return;
            }
            if (hasOpen && info.offset.y < -120) {
              onRequestOpen?.();
              return;
            }
            if (scope.current) {
              animate(
                scope.current,
                { y: pos },
                { type: "tween", duration: 1, ease: [0.19, 1, 0.22, 1] },
              );
            }
          },
        }
      : {};

  return (
    <motion.section
      initial={isHorizontal ? { x: "100%", y: 0 } : { y: "100%", x: 0 }}
      animate={
        isHorizontal
          ? isReady
            ? { x: pos, y: 0 }
            : { x: "100%", y: 0 }
          : isReady
            ? { y: pos, x: 0 }
            : { y: "100%", x: 0 }
      }
      exit={isHorizontal ? { x: "100%", y: 0 } : { y: "100%", x: 0 }}
      transition={{
        type: "tween",
        duration: 1,
        ease: [0.19, 1, 0.22, 1],
        delay: transitionDelay,
      }}
      ref={scope}
      className={cn(
        "group absolute inset-0 overflow-x-auto overflow-y-hidden transition-colors duration-300 ease-in-out",
        !isHorizontal ? "bg-paper" : isActive ? "bg-paper" : "bg-surface",
        !isActive && "cursor-alias",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        boxShadow:
          "-8px 0 16px -2px rgba(0,0,0,0.08), 0 -8px 16px -2px rgba(0,0,0,0.08), -1px -1px 4px 0 rgba(0,0,0,0.06)",
        ...(!isHorizontal && isDraggable ? { touchAction: "none" } : {}),
      }}
      {...dragProps}
    >
      <span
        className={cn(
          "absolute px-3 py-1 font-mono text-2xs text-muted transition-colors duration-200 select-none",
          isHorizontal
            ? "top-4 left-4 border border-border/30 group-hover:border-transparent group-hover:bg-border/30"
            : "top-7 left-1/2 -translate-x-1/2 text-xs",
        )}
      >
        Page {index + 1}
      </span>
    </motion.section>
  );
}

// --- Controls ---

function StackControls({
  isMobile,
  numCards,
  onAdd,
  onRemove,
}: {
  isMobile: boolean;
  numCards: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 z-50",
        isMobile ? "flex flex-col" : "flex flex-col gap-1",
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        className={cn(
          isMobile
            ? "flex h-12 w-12 cursor-pointer items-center justify-center bg-paper text-ink active:bg-surface"
            : "inline-block cursor-pointer border border-ink-inv/30 bg-transparent p-2 font-mono text-2xs text-ink-inv transition-colors duration-300 select-none hover:border-transparent hover:bg-ink-inv/30",
        )}
      >
        <Plus className={cn(isMobile ? "h-5 w-5 text-muted" : "h-3 w-3")} weight="regular" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        disabled={numCards <= 0}
        className={cn(
          "disabled:cursor-not-allowed disabled:opacity-50",
          isMobile
            ? "flex h-12 w-12 cursor-pointer items-center justify-center border-t-2 border-border bg-paper text-ink active:bg-surface"
            : "inline-block cursor-pointer border border-ink-inv/30 bg-transparent p-2 font-mono text-2xs text-ink-inv transition-colors duration-300 select-none hover:border-transparent hover:bg-ink-inv/30",
        )}
      >
        <Minus className={cn(isMobile ? "h-5 w-5 text-muted" : "h-3 w-3")} weight="regular" />
      </button>
    </div>
  );
}

// --- Main ---

export default function PageStack() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [peekedIndex, setPeekedIndex] = useState<number | null>(null);
  const [numCards, setNumCards] = useState(4);
  const stackRef = useRef<HTMLDivElement>(null);
  const [containerRef, bounds] = useMeasure();

  const hasMeasured = bounds.width > 0 || bounds.height > 0;
  const isMobile = hasMeasured ? bounds.width < 600 : false;
  const peekHeight = 80;

  const basePositions = useMemo(() => {
    if (isMobile) {
      const offscreen = bounds.height + 100;
      const peek = bounds.height - peekHeight;
      return Array.from({ length: numCards }, (_, i) => {
        if (activeIndex === -1) return i === 0 ? peek : offscreen;
        if (i <= activeIndex) return 0;
        if (i === activeIndex + 1) return peek;
        return offscreen;
      });
    }
    return getStackPositions(activeIndex, numCards, bounds.width);
  }, [isMobile, activeIndex, bounds.width, bounds.height, numCards]);

  const peekOffsets = useMemo(() => {
    if (isMobile) return Array.from<number>({ length: numCards }).fill(0);
    return getPeekOffsets(peekedIndex, activeIndex, numCards);
  }, [isMobile, peekedIndex, activeIndex, numCards]);

  const isHorizontal = !isMobile;

  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!stackRef.current?.contains(target)) setActiveIndex(-1);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-ink">
      <div className="absolute top-4 left-4 z-50">
        <span
          className={cn(
            "inline-block border px-3 py-1 font-mono text-2xs transition-colors duration-500 select-none",
            isMobile && activeIndex >= 0
              ? "border-mid/30 text-muted"
              : "border-ink-inv/30 text-ink-inv",
          )}
        >
          {numCards} pages
        </span>
      </div>

      <div ref={stackRef}>
        <AnimatePresence>
          {Array.from({ length: numCards }, (_, i) => (
            <StackCard
              key={i}
              index={i}
              isReady={hasMeasured}
              pos={basePositions[i] + peekOffsets[i]}
              isHorizontal={isHorizontal}
              onMouseEnter={() => setPeekedIndex(i)}
              onMouseLeave={() => setPeekedIndex(null)}
              onClick={() => {
                if (isMobile) {
                  if (i !== activeIndex) setActiveIndex(i);
                } else {
                  setActiveIndex(i);
                }
              }}
              isDraggable={isMobile && (i === activeIndex || i === activeIndex + 1)}
              onRequestClose={i === activeIndex ? () => setActiveIndex((p) => p - 1) : undefined}
              onRequestOpen={
                i === activeIndex + 1
                  ? () => setActiveIndex((p) => Math.min(p + 1, numCards - 1))
                  : undefined
              }
              isActive={i === activeIndex}
              transitionDelay={i === activeIndex + 2 && isMobile ? 0.3 : 0}
            />
          ))}
        </AnimatePresence>
      </div>

      <StackControls
        isMobile={isMobile}
        numCards={numCards}
        onAdd={() => {
          setNumCards((p) => p + 1);
          setActiveIndex(numCards);
        }}
        onRemove={() => {
          if (numCards > 0) {
            setNumCards((p) => p - 1);
            setActiveIndex((p) => {
              const next = numCards - 1;
              return p >= next ? Math.max(0, next - 1) : p;
            });
          }
        }}
      />
    </div>
  );
}
