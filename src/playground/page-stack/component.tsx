"use client";

import { cn } from "@/lib/cn";
import {
  BookOpenText,
  Image,
  Lightbulb,
  MapPin,
  Stack,
  User,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentType } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

// --- Types & Constants ---

type CardId = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const ACCENT = "#c6672e";

const CARD_WIDTHS: Record<CardId, number> = {
  a: 600,
  b: 600,
  c: 420,
  d: 500,
  e: 450,
  f: 360,
  g: 550,
};

const STACK_INCREMENT = 30;
const CLOSED_APPROACHING = [20, 0];
const OPEN_APPROACHING = [80, 40, 20, 10, 0];
const COLLAPSED_APPROACHING = [180, 90, 30, 0];
const PEEK_LEFT = -20;
const PEEK_RIGHT = [20, 30, 40, 50, 60];
const MAX_OPEN = 5;
const MAX_CLOSED = 2;
const MAX_COLLAPSED = 4;
const CARD_BLEED = 80;

// --- Position Calculations ---

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
    return vw * 0.1;
  }
  const ao = calcApproach(idx, total, eff, collapsed);
  const inc = calcIncrement(idx, total, eff, collapsed);
  return !collapsed && isOpen ? vw * 0.1 + ao + inc : vw - ao - inc;
}

function getStackPositions(active: number, stack: CardId[], vw: number): number[] {
  const total = stack.length;
  const pos = Array.from<number>({ length: total }).fill(0);

  if (active === -1) {
    // Collapsed — all stacked from right
    for (let i = 0; i < total; i++) pos[i] = getPos(i, total, false, vw, true);
    return pos;
  }

  // Phase 1: Compute uniform fan positions using the standard algorithm
  const numOpen = active + 1;
  for (let i = 0; i < numOpen; i++) {
    pos[i] = getPos(i, numOpen, true, vw);
  }

  const closed = total - numOpen;
  for (let i = 0; i < closed; i++) {
    pos[numOpen + i] = getPos(i, closed, false, vw);
  }

  // Phase 2: Cap each open card so its visible portion doesn't exceed its width.
  // Walk backwards from the active card — each card's position must be at least
  // (next card's position - this card's width), preventing a narrow card from
  // being placed so far left that it extends past the card above it.
  const widths = stack.map((id) => CARD_WIDTHS[id]);
  for (let i = active; i >= 0; i--) {
    if (i <= active - MAX_OPEN) continue;
    const ref = i + 1 < total ? pos[i + 1] : vw;
    pos[i] = Math.max(pos[i], ref - widths[i]);
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

// --- Icon mapping per card type ---

const CARD_ICON: Record<CardId, ComponentType<{ weight?: string; className?: string }>> = {
  a: BookOpenText,
  b: MapPin,
  c: Image,
  d: Stack,
  e: User,
  f: Lightbulb,
  g: Image,
};

// --- Small Utility Components ---

function MentionLink({
  children,
  target,
  onNavigate,
}: {
  children: React.ReactNode;
  target: CardId;
  onNavigate: (target: CardId) => void;
}) {
  const Icon = CARD_ICON[target];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onNavigate(target);
      }}
      className="inline-flex cursor-pointer items-baseline gap-1 transition-opacity hover:opacity-70"
    >
      <span
        className="relative top-[0.05em] inline-flex shrink-0 items-center justify-center rounded-[4px] p-[3px]"
        style={{ backgroundColor: "rgba(198, 103, 46, 0.08)" }}
      >
        <Icon weight="regular" className="h-[0.85em] w-[0.85em]" style={{ color: "#7a4a28" }} />
      </span>
      <span
        className="underline decoration-1 underline-offset-2"
        style={{ color: "#696966", textDecorationColor: ACCENT }}
      >
        {children}
      </span>
    </button>
  );
}

function CategoryLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase"
      style={{ color: ACCENT }}
    >
      {children}
    </span>
  );
}

function ImagePlaceholder({ height, label }: { height: number; label?: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        height,
        background: "linear-gradient(135deg, #e8e5e0 0%, #d4d0ca 50%, #c8c4be 100%)",
      }}
    >
      {label && (
        <span className="font-mono text-[10px] tracking-widest text-[#9c9890] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

// --- 7 Card Content Components ---

function CardAContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex min-h-full flex-col p-12">
      <CategoryLabel>Essay</CategoryLabel>
      <div className="h-20" />
      <h1
        className="text-[56px] font-medium leading-[60px] text-[#111110]"
        style={{ letterSpacing: "-0.02em" }}
      >
        On Quiet
        <br />
        Architecture
      </h1>
      <div className="h-8" />
      <p className="text-[16px] leading-[26px] text-[#4a4a47]">
        There is a kind of building that does not shout.
        <br />
        It breathes with the landscape, ages with grace,
        <br />
        and finds its beauty in what it chooses to leave out.
      </p>
      <div className="flex-1" />
      <p className="text-[14px] leading-[22px] text-[#4a4a47]">
        An exploration of restraint — from{" "}
        <MentionLink target="b" onNavigate={onNavigate}>
          Therme Vals
        </MentionLink>{" "}
        to{" "}
        <MentionLink target="f" onNavigate={onNavigate}>
          Wabi-Sabi
        </MentionLink>
        , through the lens of{" "}
        <MentionLink target="e" onNavigate={onNavigate}>
          Peter Zumthor
        </MentionLink>{" "}
        and a{" "}
        <MentionLink target="d" onNavigate={onNavigate}>
          Material Palette
        </MentionLink>{" "}
        that ages with honesty.
      </p>
    </div>
  );
}

function CardBContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="px-11 py-10">
      <CategoryLabel>Place</CategoryLabel>
      <div className="h-4" />
      <h2
        className="text-[32px] font-semibold leading-[38px] text-[#111110]"
        style={{ letterSpacing: "-0.01em" }}
      >
        Therme Vals
      </h2>
      <div className="h-7" />
      <p className="text-[14px] leading-[24px] text-[#4a4a47]">
        Nestled in the Swiss Alps,{" "}
        <MentionLink target="e" onNavigate={onNavigate}>
          Peter Zumthor
        </MentionLink>
        &rsquo;s thermal baths are carved from 60,000 slabs of locally quarried Vals gneiss. The
        building doesn&rsquo;t sit on the landscape — it emerges from it, as though the mountain
        itself decided to make room for water and stone.
      </p>
      <div className="h-7" />
      <ImagePlaceholder height={355} label="Therme Vals exterior" />
      <div className="h-5" />
      <p className="text-[14px] leading-[24px] text-[#4a4a47]">
        Every surface is deliberate. The stone is laid in precise courses that echo geological
        strata. Light enters through thin slits in the roof, drawing bright lines across dark water.
        There is a room that smells of herbs, another of petals. The sound of moving water is
        everywhere.
      </p>
      <div className="h-5" />
      <p className="text-[14px] leading-[24px] text-[#4a4a47]">
        Zumthor speaks of architecture as atmosphere — the tension between interior and exterior, the
        way the{" "}
        <MentionLink target="d" onNavigate={onNavigate}>
          Material Palette
        </MentionLink>{" "}
        of stone, water, and filtered light can make you forget time. This is{" "}
        <MentionLink target="f" onNavigate={onNavigate}>
          Wabi-Sabi
        </MentionLink>{" "}
        at its most elemental —{" "}
        <MentionLink target="c" onNavigate={onNavigate}>
          The Atrium at Dusk
        </MentionLink>{" "}
        holding its breath.
      </p>
    </div>
  );
}

function CardCContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex flex-col p-6">
      <div className="h-[111px]" />
      <div className="py-6">
        <CategoryLabel>Media</CategoryLabel>
        <div className="h-3" />
        <h2 className="text-[28px] font-bold leading-[34px] text-[#111110]">
          The Atrium
          <br />
          at Dusk
        </h2>
        <div className="h-3" />
        <p className="text-[14px] leading-[22px] text-[#4a4a47]">
          The last light of day enters through a narrow clerestory, casting a warm line across the
          concrete floor. A study in light and{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            Wabi-Sabi
          </MentionLink>{" "}
          — the space holds its breath, somewhere between silence and sound.
        </p>
      </div>
      <ImagePlaceholder height={500} label="Atrium interior" />
    </div>
  );
}

function CardDContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  const materials = [
    { num: "01", name: "Travertine", desc: "Quarried from the Swiss Alps, every slab tells a geological story" },
    { num: "02", name: "White Oak", desc: "Quarter-sawn for stability, it mellows to honey over the years" },
    { num: "03", name: "Brushed Brass", desc: "Develops a living patina over decades of touch" },
    { num: "04", name: "Raw Concrete", desc: "Board-formed to capture the grain of timber in stone" },
    { num: "05", name: "Handmade Ceramic", desc: "Each tile carries the slight asymmetry of the maker\u2019s hand" },
  ];

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="px-3">
        <CategoryLabel>Collection</CategoryLabel>
        <div className="h-3.5" />
        <h2
          className="text-[28px] font-semibold leading-[34px] text-[#111110]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Material Palette
        </h2>
        <div className="h-3.5" />
        <p className="text-[14px] leading-[22px] text-[#4a4a47]">
          A curated selection of materials that define the practice — chosen for how they age, how
          they embody{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            Wabi-Sabi
          </MentionLink>
          , and how they appear in{" "}
          <MentionLink target="g" onNavigate={onNavigate}>
            Light Studies
          </MentionLink>
          .
        </p>
      </div>
      <div className="flex-1" />
      <div>
        {materials.map((m, i) => (
          <div key={m.num}>
            <div className="flex flex-col gap-1.5 px-3 py-3 transition-colors duration-150 hover:bg-[#e9e9e5]">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-[#111110]">{m.name}</span>
                <span className="font-mono text-[12px] text-[#9c9c98]">{m.num}</span>
              </div>
              <p className="text-[13px] leading-[20px] text-[#4a4a47]">{m.desc}</p>
            </div>
            {i < materials.length - 1 && <div className="h-px bg-[#dcdcd8]" />}
          </div>
        ))}
        <div className="h-px bg-[#dcdcd8]" />
      </div>
    </div>
  );
}

function CardEContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex flex-col">
      <ImagePlaceholder height={450} label="Portrait" />
      <div className="px-9 pt-8">
        <CategoryLabel>Person</CategoryLabel>
        <div className="h-3.5" />
        <h2
          className="text-[28px] font-semibold leading-[34px] text-[#111110]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Peter Zumthor
        </h2>
        <div className="h-2" />
        <p className="text-[13px] text-[#9c9c98]">b. 1943, Basel · Pritzker Prize 2009</p>
        <div className="h-6" />
        <p className="text-[14px] leading-[22px] text-[#4a4a47]">
          Swiss architect known for his intensely tactile approach to materials and space. His
          buildings are experienced before they are understood — spaces where stone, light, and water
          speak with more authority than any drawing.
        </p>
        <div className="h-6" />
        <p className="font-mono text-[10px] tracking-[0.08em] text-[#9c9c98] uppercase">
          Notable works
        </p>
        <div className="h-3" />
        <div className="space-y-0 text-[13px] leading-[24px] text-[#4a4a47]">
          <p>
            <MentionLink target="b" onNavigate={onNavigate}>
              Therme Vals
            </MentionLink>
            , 1996
          </p>
          <p>Kunsthaus Bregenz, 1997</p>
          <p>Bruder Klaus Chapel, 2007</p>
          <p>Zinc Mine Museum, 2016</p>
        </div>
      </div>
    </div>
  );
}

function CardFContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex min-h-full flex-col p-9">
      <div className="py-6">
        <p className="text-[24px] leading-[110%] text-[#111110]">
          Nothing lasts, nothing is finished, and nothing is perfect.
        </p>
      </div>
      <p className="font-mono text-[11px] font-medium text-[#9c9c98]">— Richard Powell</p>
      <div className="flex-1" />
      <CategoryLabel>Concept</CategoryLabel>
      <div className="h-6" />
      <h2 className="text-[32px] font-bold leading-[38px] text-[#111110]">Wabi-Sabi</h2>
      <div className="h-4" />
      <p className="text-[14px] leading-[22px] text-[#4a4a47]">
        The Japanese worldview centered on the acceptance of transience and imperfection.
      </p>
      <div className="h-5" />
      <p className="text-[14px] leading-[22px] text-[#4a4a47]">
        In architecture, wabi-sabi appears in the{" "}
        <MentionLink target="d" onNavigate={onNavigate}>
          Material Palette
        </MentionLink>{" "}
        that ages honestly — raw concrete softening, brass darkening, wood silvering. It is the
        philosophy behind{" "}
        <MentionLink target="a" onNavigate={onNavigate}>
          On Quiet Architecture
        </MentionLink>
        .
      </p>
    </div>
  );
}

function CardGContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex min-h-full flex-col">
      <ImagePlaceholder height={733} label="Light on stone" />
      <div className="flex flex-col gap-2.5 px-9 pt-6 pb-9">
        <CategoryLabel>Media</CategoryLabel>
        <h2 className="text-[24px] font-bold leading-[30px] text-[#111110]">Light Studies</h2>
        <p className="text-[14px] leading-[22px] text-[#4a4a47]">
          How natural light transforms architectural space — captured in{" "}
          <MentionLink target="c" onNavigate={onNavigate}>
            The Atrium at Dusk
          </MentionLink>{" "}
          and other moments where light meets{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            Wabi-Sabi
          </MentionLink>
          .
        </p>
      </div>
    </div>
  );
}

// --- Card Definitions ---

const CARD_DEFS: Record<
  CardId,
  {
    width: number;
    darkBg: boolean;
    Content: ComponentType<{ onNavigate: (t: CardId) => void }>;
  }
> = {
  a: { width: 600, darkBg: false, Content: CardAContent },
  b: { width: 600, darkBg: false, Content: CardBContent },
  c: { width: 420, darkBg: false, Content: CardCContent },
  d: { width: 500, darkBg: false, Content: CardDContent },
  e: { width: 450, darkBg: false, Content: CardEContent },
  f: { width: 360, darkBg: false, Content: CardFContent },
  g: { width: 550, darkBg: false, Content: CardGContent },
};

// --- StackCard ---

function StackCard({
  pos,
  width,
  containerWidth,
  isActive,
  darkBg,
  isCloseable,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onClose,
  isReady,
  transitionDelay = 0,
  children,
}: {
  pos: number;
  width: number;
  containerWidth: number;
  isActive: boolean;
  darkBg: boolean;
  isCloseable: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onClose: () => void;
  isReady: boolean;
  transitionDelay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ x: "100vw", y: 0 }}
      animate={isReady ? { x: pos, y: 0 } : { x: containerWidth, y: 0 }}
      exit={{ x: containerWidth, y: 0 }}
      transition={{
        type: "tween",
        duration: 1,
        ease: [0.19, 1, 0.22, 1],
        delay: transitionDelay,
      }}
      className={cn(
        "group absolute top-0 bottom-0 transition-colors duration-300 ease-in-out",
        darkBg ? "bg-[#1a1918]" : isActive ? "bg-paper" : "bg-surface",
        isActive ? "overflow-x-hidden overflow-y-auto" : "overflow-hidden",
        !isActive && "cursor-alias",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        width: width + CARD_BLEED,
        paddingRight: CARD_BLEED,
        boxShadow:
          "-8px 0 16px -2px rgba(0,0,0,0.08), 0 -8px 16px -2px rgba(0,0,0,0.08), -1px -1px 4px 0 rgba(0,0,0,0.06)",
      }}
    >
      {/* Close button */}
      {isCloseable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "absolute top-4 left-4 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-opacity duration-200",
            darkBg
              ? "bg-[#2c2b28] text-[#b0ada6] hover:text-[#e8e5e0]"
              : "bg-surface text-muted hover:text-ink",
            "opacity-0 group-hover:opacity-100",
          )}
        >
          <X weight="bold" className="h-3 w-3" />
        </button>
      )}
      {children}
    </motion.section>
  );
}

// --- Main Component ---

export default function PageStack() {
  const [stack, setStack] = useState<CardId[]>(["a"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [peekedIndex, setPeekedIndex] = useState<number | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [containerRef, bounds] = useMeasure();

  const hasMeasured = bounds.width > 0 || bounds.height > 0;
  const isMobile = hasMeasured ? bounds.width < 768 : false;

  const basePositions = useMemo(
    () => getStackPositions(activeIndex, stack, bounds.width),
    [activeIndex, bounds.width, stack],
  );

  const peekOffsets = useMemo(
    () => getPeekOffsets(peekedIndex, activeIndex, stack.length),
    [peekedIndex, activeIndex, stack.length],
  );

  const handleNavigate = useCallback(
    (fromIndex: number, targetId: CardId) => {
      const existingIdx = stack.indexOf(targetId);
      if (existingIdx !== -1) {
        // Already in stack — just focus it
        setActiveIndex(existingIdx);
        return;
      }
      // Remove cards after fromIndex, then append target
      setStack((prev) => [...prev.slice(0, fromIndex + 1), targetId]);
      setActiveIndex(fromIndex + 1);
    },
    [stack],
  );

  const handleClose = useCallback((stackIndex: number) => {
    if (stackIndex === 0) return; // Never close card A
    setStack((prev) => prev.filter((_, i) => i !== stackIndex));
    setActiveIndex((prev) => {
      if (stackIndex < prev) return prev - 1;
      if (stackIndex === prev) return Math.max(0, prev - 1);
      return prev;
    });
  }, []);

  // Collapse on outside click
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
      {isMobile ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm text-ink-inv">Best viewed on a wider screen.</p>
          <p className="font-mono text-2xs text-ink-inv/50">
            Resize your browser or switch to a desktop device.
          </p>
        </div>
      ) : (
        <div ref={stackRef}>
          <AnimatePresence>
            {stack.map((cardId, i) => {
              const def = CARD_DEFS[cardId];
              return (
                <StackCard
                  key={cardId}
                  width={def.width}
                  containerWidth={bounds.width}
                  darkBg={def.darkBg}
                  isReady={hasMeasured}
                  pos={basePositions[i] + (peekOffsets[i] ?? 0)}
                  isActive={i === activeIndex}
                  isCloseable={i !== 0}
                  onMouseEnter={() => setPeekedIndex(i)}
                  onMouseLeave={() => setPeekedIndex(null)}
                  onClick={() => setActiveIndex(i)}
                  onClose={() => handleClose(i)}
                >
                  <def.Content onNavigate={(t) => handleNavigate(i, t)} />
                </StackCard>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
