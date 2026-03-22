"use client";

import { cn } from "@/lib/cn";
import { ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const DESKTOP_BP = 560;

const FEATURES = [
  {
    id: "walk",
    title: "Walk",
    tagline: "Learn the scale",
    description:
      "The only honest way to know a city. Notice what's at knee height, what's been painted over, where the sidewalk ends.",
    bg: "linear-gradient(175deg, #1c0f08 0%, #5c2c0e 45%, #9c4c1a 100%)",
  },
  {
    id: "eat",
    title: "Eat",
    tagline: "Follow the regulars",
    description:
      "The best table is always taken. Follow the locals, not the lists. The best meal rarely has a name in English.",
    bg: "linear-gradient(175deg, #1a0f04 0%, #553c0c 45%, #9a6c1a 100%)",
  },
  {
    id: "linger",
    title: "Linger",
    tagline: "Stay too long",
    description:
      "Choose one corner and stay until you're no longer a stranger to it. You'll learn more than any itinerary.",
    bg: "linear-gradient(175deg, #061318 0%, #0d3040 45%, #175568 100%)",
  },
] as const;

type Feature = (typeof FEATURES)[number];

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
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Background element is 140% of card height (20% overshoot each side),
  // so 10% translate of background ≈ 14% of card — safely within the 20% margin.
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const flexGrow = isDesktop ? (isActive ? 3 : isAnyActive ? 0.4 : 1) : 1;

  // Desktop: fixed pixel size so the gradient div never resizes during the flex animation —
  // no per-frame repaints. Card's overflow:hidden clips as needed.
  // Mobile: oversized by 20% for parallax headroom.
  const bgStyle = isDesktop
    ? ({ background: feature.bg, position: "absolute" as const, inset: "-50px" } as const)
    : ({
        background: feature.bg,
        top: "-20%",
        right: "-20%",
        bottom: "-20%",
        left: "-20%",
        y: parallaxY,
      } as const);

  return (
    <motion.div
      ref={cardRef}
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
      {/* Background gradient */}
      <motion.div className="absolute" style={bgStyle} />

      {/* Bottom-up vignette for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
        }}
      />

      {/* Content
          Desktop: absolutely pinned to card bottom-left with a large fixed width — card's
          overflow:hidden clips what falls outside the current card boundary. No width
          constraint means the text wraps at a generous width. Since description is only
          mounted when active (AnimatePresence), inactive cards have zero description height
          so the title sits flush at the bottom.
          Mobile: in-flow at the bottom via the parent's justify-end. */}
      <div
        className={cn("z-10 p-5 pb-6", isDesktop ? "absolute bottom-0 left-0" : "relative")}
        style={isDesktop ? { width: "28rem" } : undefined}
      >
        {/* Title — fades on inactive cards */}
        <motion.h3
          className="text-base leading-snug font-semibold text-white"
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

        {/* Description + tagline
            Desktop: AnimatePresence — only in DOM when active, so the title truly sits at
            the card's bottom edge when no card is hovered.
            Mobile: always visible, no animation. */}
        <AnimatePresence initial={false}>
          {(!isDesktop || isActive) && (
            <motion.div
              key="description"
              initial={isDesktop ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="pt-2.5">
                <p className="text-sm leading-relaxed text-white/75">{feature.description}</p>
                <div className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-medium text-white/90">
                  <span>{feature.tagline}</span>
                  <motion.span
                    animate={{ x: isActive && isDesktop ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={13} weight="bold" />
                  </motion.span>
                </div>
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

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BP}px)`);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (!e.matches) setActiveId(null);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
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
