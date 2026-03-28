"use client";

import { cn } from "@/lib/cn";
import { scaleTransition, useSpeedControl } from "@/lib/speed-context";
import { animate, motion, useMotionValue, useTransform, useVelocity } from "motion/react";
import { useEffect, useState } from "react";

const OPTIONS = [
  { label: "Projects", emoji: "🔧" },
  { label: "Essays", emoji: "📝" },
  { label: "Photos", emoji: "📷" },
  { label: "Videos", emoji: "🎬" },
  { label: "Archive", emoji: "📦" },
] as const;

type Option = (typeof OPTIONS)[number]["label"];

const ITEM_HEIGHT = 48;
const GAP = 16;
const STRIDE = ITEM_HEIGHT + GAP;

// Clip window shows all 5 rows (2 on each side of the active item)
const VISIBLE_HEIGHT = ITEM_HEIGHT * 5 + GAP * 4;
// Y position where the active item's top should land inside the clip window
const CENTER_Y = VISIBLE_HEIGHT / 2 - ITEM_HEIGHT / 2;

// Emoji clip: just one item tall with breathing room for the fade
const EMOJI_CLIP = 80;
const EMOJI_CENTER_Y = EMOJI_CLIP / 2 - ITEM_HEIGHT / 2;

// Gradient mask: fade top/bottom edges of the emoji clip window
const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)";

export default function VariableFontSelector() {
  const { factor } = useSpeedControl();
  const [active, setActive] = useState<Option>("Photos");

  const activeIndex = OPTIONS.findIndex((o) => o.label === active);

  const listY = CENTER_Y - activeIndex * STRIDE;
  // Active emoji centered in the small clip window
  const emojiY = EMOJI_CENTER_Y - activeIndex * STRIDE;

  // Stable motion value for emoji so velocity tracking works correctly
  const emojiYMV = useMotionValue(emojiY);
  useEffect(() => {
    const controls = animate(
      emojiYMV,
      emojiY,
      scaleTransition({ type: "spring", duration: 0.5, bounce: 0 }, factor),
    );
    return controls.stop;
  }, [emojiY, emojiYMV, factor]);

  const emojiVelocity = useVelocity(emojiYMV);
  const blurFilter = useTransform(emojiVelocity, [-600, 0, 600], [6, 0, 6]);
  const filterStyle = useTransform(blurFilter, (v) => `blur(${v}px)`);

  return (
    <div className="absolute inset-0 flex items-center justify-start overflow-hidden">
      <div className="flex items-center gap-6 pl-10">
        {/* Emoji column — single-item clip with gradient fade at edges */}
        <div
          className="shrink-0"
          style={{
            height: EMOJI_CLIP,
            overflow: "hidden",
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        >
          <motion.ul
            className="flex flex-col"
            style={{ gap: GAP, y: emojiYMV, filter: filterStyle }}
          >
            {OPTIONS.map(({ label, emoji }) => (
              <li
                key={label}
                className="flex items-center justify-center text-4xl"
                style={{ height: ITEM_HEIGHT }}
              >
                {emoji}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Clip window */}
        <div style={{ height: VISIBLE_HEIGHT, overflow: "hidden" }}>
          <motion.ul
            className="flex flex-col"
            style={{ gap: GAP }}
            initial={false}
            animate={{ y: listY }}
            transition={scaleTransition({ type: "spring", duration: 0.5, bounce: 0 }, factor)}
          >
            {OPTIONS.map(({ label }) => {
              const isActive = label === active;
              return (
                <li key={label} style={{ height: ITEM_HEIGHT }}>
                  <motion.button
                    className={cn(
                      "flex h-full items-center bg-transparent text-left leading-none transition-colors duration-200",
                      isActive ? "text-ink" : "text-muted hover:text-dim",
                    )}
                    initial={false}
                    animate={{
                      fontWeight: isActive ? 600 : 300,
                      fontSize: isActive ? "60px" : "48px",
                    }}
                    transition={scaleTransition(
                      { type: "spring", duration: 0.5, bounce: 0 },
                      factor,
                    )}
                    type="button"
                    onClick={() => setActive(label)}
                  >
                    {label}
                  </motion.button>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
