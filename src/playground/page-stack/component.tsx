"use client";

import { cn } from "@/lib/cn";
import { X } from "@phosphor-icons/react";
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
    return vw * 0.2;
  }
  const ao = calcApproach(idx, total, eff, collapsed);
  const inc = calcIncrement(idx, total, eff, collapsed);
  return !collapsed && isOpen ? vw * 0.2 + ao + inc : vw - ao - inc;
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
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onNavigate(target);
      }}
      className="cursor-pointer underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
      style={{ color: ACCENT }}
    >
      {children}
    </button>
  );
}

function TagBar({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.12em] uppercase">
      {tags.map((tag, i) => (
        <span key={tag} className="flex items-center gap-2" style={{ color: ACCENT }}>
          {i > 0 && (
            <span className="text-[8px] opacity-50" style={{ color: ACCENT }}>
              ·
            </span>
          )}
          {tag}
        </span>
      ))}
    </div>
  );
}

function ImagePlaceholder({ height = 300, label }: { height?: number; label?: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-sm"
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
    <div className="flex min-h-full flex-col justify-between px-10 py-12 text-[#e8e5e0]">
      <div>
        <TagBar tags={["Architecture", "Philosophy", "Space"]} />
        <h1 className="mt-8 text-[32px] leading-[1.1] font-light tracking-tight">
          On Quiet
          <br />
          Architecture
        </h1>
        <div className="mt-8 max-w-[460px] space-y-4 text-sm leading-relaxed text-[#b0ada6]">
          <p>
            There is a kind of building that does not announce itself. It waits. It allows the
            weather to speak first, then the light, then the silence between footsteps on stone.
          </p>
          <p>
            Consider{" "}
            <MentionLink target="b" onNavigate={onNavigate}>
              Therme Vals
            </MentionLink>{" "}
            — carved into the mountainside as though it had always been there. Or the Japanese
            concept of{" "}
            <MentionLink target="f" onNavigate={onNavigate}>
              wabi-sabi
            </MentionLink>
            , which finds beauty in impermanence and imperfection.
          </p>
          <p>
            <MentionLink target="e" onNavigate={onNavigate}>
              Peter Zumthor
            </MentionLink>{" "}
            once wrote that architecture is not about form. It is about a careful arrangement of
            substances — a{" "}
            <MentionLink target="d" onNavigate={onNavigate}>
              material palette
            </MentionLink>{" "}
            chosen not for appearance but for the way it ages, warms, breathes.
          </p>
        </div>
      </div>
      <p className="mt-12 font-mono text-[10px] tracking-[0.15em] text-[#6b6862] uppercase">
        An interconnected essay in seven parts
      </p>
    </div>
  );
}

function CardBContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="px-10 py-12">
      <TagBar tags={["Place", "Thermal Baths", "Switzerland"]} />
      <h2 className="mt-6 text-[26px] leading-[1.15] font-light tracking-tight text-ink">
        Therme Vals
      </h2>
      <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        Graubünden, Switzerland · 1996
      </p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-dim">
        <p>
          Built from 60,000 slabs of local Valser quartzite, the thermal baths are simultaneously
          cave and temple. The stone was quarried from the same mountain the building occupies — it
          is, in some sense, the mountain turned inside out.
        </p>
        <ImagePlaceholder height={240} label="Interior view" />
        <p>
          Designed by{" "}
          <MentionLink target="e" onNavigate={onNavigate}>
            Peter Zumthor
          </MentionLink>
          , the building channels water through spaces of varying temperature and light. You move
          from warm to cold, dark to light, enclosed to open. The{" "}
          <MentionLink target="d" onNavigate={onNavigate}>
            material palette
          </MentionLink>{" "}
          is deliberately restrained — stone, water, air.
        </p>
        <ImagePlaceholder height={200} label="Light shaft" />
        <p>
          There is a quality of attention here that approaches the spirit of{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            wabi-sabi
          </MentionLink>{" "}
          — not through rusticity, but through a reduction so thorough that every remaining element
          becomes essential. Each surface reveals itself slowly: the way condensation beads on cool
          stone, the way sound changes between{" "}
          <MentionLink target="c" onNavigate={onNavigate}>
            the atrium
          </MentionLink>{" "}
          and the interior pools.
        </p>
      </div>
    </div>
  );
}

function CardCContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex flex-col">
      <ImagePlaceholder height={500} label="The atrium at dusk" />
      <div className="px-8 py-8">
        <TagBar tags={["Photography", "Light"]} />
        <h2 className="mt-4 text-[22px] leading-[1.15] font-light tracking-tight text-ink">
          The Atrium at Dusk
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-dim">
          <p>
            As daylight fades, the atrium transforms. The quartzite walls absorb the last warm tones
            of the setting sun while the water surface becomes a mirror, doubling the geometry
            above.
          </p>
          <p>
            This quality of transience — architecture shaped as much by time as by stone — echoes
            the philosophy of{" "}
            <MentionLink target="f" onNavigate={onNavigate}>
              wabi-sabi
            </MentionLink>
            , where impermanence is not a defect but a feature.
          </p>
        </div>
      </div>
    </div>
  );
}

function CardDContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  const materials = [
    {
      num: "01",
      name: "Valser Quartzite",
      desc: "Layered metamorphic stone from the Graubünden Alps. Cool grey-green with occasional veins of mica.",
    },
    {
      num: "02",
      name: "Pigmented Concrete",
      desc: "Tinted to match the local granite. Smooth-formed, left uncoated to develop patina over decades.",
    },
    {
      num: "03",
      name: "Brass Fixtures",
      desc: "Untreated brass that oxidizes naturally, shifting from gold to deep brown in humid thermal air.",
    },
    {
      num: "04",
      name: "Leather (Aniline)",
      desc: "Full-grain, undyed leather on seating. Develops a unique surface record of every hand that touches it.",
    },
    {
      num: "05",
      name: "Water",
      desc: "Thermal spring water at 30°C. Not merely plumbing — the primary architectural material, shaping how every surface is experienced.",
    },
  ];

  return (
    <div className="px-10 py-12">
      <TagBar tags={["Materials", "Craft", "Detail"]} />
      <h2 className="mt-6 text-[26px] leading-[1.15] font-light tracking-tight text-ink">
        Material Palette
      </h2>
      <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        5 substances, chosen to age
      </p>

      <div className="mt-8 space-y-6">
        {materials.map((m) => (
          <div key={m.num} className="flex gap-4">
            <span
              className="shrink-0 font-mono text-[11px] font-medium tabular-nums"
              style={{ color: ACCENT }}
            >
              {m.num}
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{m.name}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-dim">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-3 text-sm leading-relaxed text-dim">
        <p>
          Every material here was chosen for how it would look in twenty years, not on opening day.
          This is the philosophy of{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            wabi-sabi
          </MentionLink>{" "}
          applied to construction — beauty through wear, through the honest passage of time.
        </p>
        <p>
          See also:{" "}
          <MentionLink target="g" onNavigate={onNavigate}>
            light studies
          </MentionLink>{" "}
          — how these materials transform under shifting illumination.
        </p>
      </div>
    </div>
  );
}

function CardEContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="px-10 py-12">
      <ImagePlaceholder height={280} label="Portrait" />
      <div className="mt-8">
        <TagBar tags={["Person", "Architect"]} />
        <h2 className="mt-4 text-[26px] leading-[1.15] font-light tracking-tight text-ink">
          Peter Zumthor
        </h2>
        <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
          b. 1943 · Basel, Switzerland
        </p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-dim">
          <p>
            Swiss architect known for an intensely sensory approach to building. His work resists
            the spectacular in favor of the atmospheric — spaces designed to be felt before they are
            seen.
          </p>
          <p>
            Pritzker Prize laureate (2009). Works primarily in Switzerland and maintains a small
            practice in Haldenstein, deliberately limiting the number of commissions to preserve
            quality of attention.
          </p>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            Notable works
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-dim">
            <li>
              <MentionLink target="b" onNavigate={onNavigate}>
                Therme Vals
              </MentionLink>
              <span className="ml-2 text-muted">· 1996</span>
            </li>
            <li>
              Bruder Klaus Chapel<span className="ml-2 text-muted">· 2007</span>
            </li>
            <li>
              Kolumba Museum<span className="ml-2 text-muted">· 2007</span>
            </li>
            <li>
              Zinc Mine Museum<span className="ml-2 text-muted">· 2016</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CardFContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="px-8 py-12">
      <TagBar tags={["Concept", "Philosophy"]} />
      <h2 className="mt-6 text-[26px] leading-[1.15] font-light tracking-tight text-ink">
        Wabi-Sabi
      </h2>
      <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        侘寂 · beauty in imperfection
      </p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-dim">
        <p>
          A Japanese aesthetic rooted in the acceptance of transience and imperfection. Derived from
          Buddhist teachings on the three marks of existence: impermanence, suffering, and
          emptiness.
        </p>

        <blockquote
          className="my-6 border-l-2 py-1 pl-5 text-[15px] leading-relaxed text-ink italic"
          style={{ borderColor: ACCENT }}
        >
          &ldquo;Pare down to the essence, but don&rsquo;t remove the poetry.&rdquo;
        </blockquote>

        <p>
          In architecture, wabi-sabi manifests not as a style but as a stance — choosing materials
          that record the passage of time, details that reward slow looking, spaces where silence is
          a feature. See how this thinking shapes the{" "}
          <MentionLink target="d" onNavigate={onNavigate}>
            material palette
          </MentionLink>{" "}
          at Therme Vals.
        </p>
        <p>
          Return to{" "}
          <MentionLink target="a" onNavigate={onNavigate}>
            On Quiet Architecture
          </MentionLink>{" "}
          for the broader argument.
        </p>
      </div>
    </div>
  );
}

function CardGContent({ onNavigate }: { onNavigate: (t: CardId) => void }) {
  return (
    <div className="flex flex-col">
      <ImagePlaceholder height={420} label="Light studies" />
      <div className="px-8 py-6">
        <TagBar tags={["Photography", "Light", "Material"]} />
        <h2 className="mt-3 text-[20px] leading-[1.15] font-light tracking-tight text-ink">
          Light Studies
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-dim">
          The way light enters a space is itself a material. In Zumthor&rsquo;s buildings, apertures
          are tuned like instruments — narrow slots that rake across stone, overhead voids that pour
          light into pools. See these surfaces at rest in{" "}
          <MentionLink target="c" onNavigate={onNavigate}>
            the atrium at dusk
          </MentionLink>
          , or read about the philosophy of impermanent beauty in{" "}
          <MentionLink target="f" onNavigate={onNavigate}>
            wabi-sabi
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
  a: { width: 600, darkBg: true, Content: CardAContent },
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
