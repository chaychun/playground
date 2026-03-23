"use client";

import { cn } from "@/lib/cn";
import { ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DESKTOP_BP = 632;

// --- Data ---

const FEATURES = [
  {
    id: "define" as const,
    index: "01",
    title: "Define",
    tagline: "Nail the brief",
    cta: "Start with a brief",
    description: "We figure out what actually needs to be built before anything gets designed.",
  },
  {
    id: "build" as const,
    index: "02",
    title: "Build",
    tagline: "Design and code together",
    cta: "See how we work",
    description:
      "No handoffs. Design and engineering work in parallel so nothing gets lost in translation.",
  },
  {
    id: "ship" as const,
    index: "03",
    title: "Ship",
    tagline: "Launch it",
    cta: "View past work",
    description:
      "Get it live fast and improve from a real baseline. Prototypes only get you so far.",
  },
] as const;

type Feature = (typeof FEATURES)[number];

// --- Card ---

function Card({
  feature,
  isActive,
  isAnyActive,
  isDesktop,
  onMouseEnter,
}: {
  feature: Feature;
  isActive: boolean;
  isAnyActive: boolean;
  isDesktop: boolean;
  onMouseEnter: () => void;
}) {
  const flexGrow = isDesktop ? (isActive ? 3 : isAnyActive ? 0.4 : 1) : 1;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        !isDesktop && "flex min-h-[280px] w-full flex-col justify-end",
        isDesktop && "h-full",
      )}
      style={{ minWidth: 0, flexShrink: 1, flexBasis: "0%" }}
      initial={{ flexGrow: 1 }}
      animate={{ flexGrow }}
      transition={{ duration: 0.5, ease: EASE }}
      onMouseEnter={isDesktop ? onMouseEnter : undefined}
    >
      {/* Surface background */}
      <div className="absolute inset-0 bg-surface" />

      {/* Step number — large decorative depth element, top-right */}
      <motion.span
        className="pointer-events-none absolute top-3 right-2 font-sans text-[88px] leading-none font-bold text-ink select-none"
        style={{ fontVariantNumeric: "tabular-nums" }}
        animate={{ opacity: isAnyActive && !isActive ? 0.03 : 0.08 }}
        transition={{ duration: 0.35, ease: EASE }}
        aria-hidden="true"
      >
        {feature.index}
      </motion.span>

      {/* Content
          Desktop: absolutely pinned to card bottom-left with a large fixed width.
          Mobile: in-flow at the bottom via the parent's justify-end. */}
      <div
        className={cn("z-10 p-5 pb-6", isDesktop ? "absolute bottom-0 left-0" : "relative")}
        style={isDesktop ? { width: "28rem" } : undefined}
      >
        {/* Title — fades on inactive cards */}
        <motion.h3
          className="font-serif text-2xl leading-tight font-light text-ink italic"
          animate={
            isDesktop
              ? {
                  opacity: isAnyActive && !isActive ? 0 : 1,
                  filter: isAnyActive && !isActive ? "blur(4px)" : "blur(0px)",
                }
              : { opacity: 1, filter: "blur(0px)" }
          }
          transition={{ duration: 0.35, ease: EASE }}
        >
          {feature.title}
        </motion.h3>

        {/* Description + CTA */}
        <AnimatePresence initial={false}>
          {(!isDesktop || isActive) && (
            <motion.div
              key="description"
              initial={isDesktop ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="pt-3">
                <div className="mb-3 h-px bg-border" />
                <p className="text-sm leading-relaxed text-dim">{feature.description}</p>
                <button className="group mt-4 flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink">
                  {feature.cta}
                  <ArrowRight
                    size={13}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FeatureCards() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      const desktop = entry.contentRect.width >= DESKTOP_BP;
      setIsDesktop(desktop);
      if (!desktop) setActiveId(null);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full gap-0.5", isDesktop ? "h-full flex-row" : "flex-col")}
      onMouseLeave={() => isDesktop && setActiveId(null)}
    >
      {FEATURES.map((feature) => (
        <Card
          key={feature.id}
          feature={feature}
          isActive={activeId === feature.id}
          isAnyActive={activeId !== null}
          isDesktop={isDesktop}
          onMouseEnter={() => setActiveId(feature.id)}
        />
      ))}
    </div>
  );
}
