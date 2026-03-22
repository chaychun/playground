"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface LotusAccordionProps {
  items: AccordionItem[];
  className?: string;
}

const PETAL_OPEN_DELAYS = [0.05, 0.1, 0.15, 0.2] as const;
const PETAL_CLOSE_DELAYS = [0.12, 0.08, 0.04, 0] as const;

const PETALS = [
  {
    key: "n",
    d: "M20,19.2 L13.6,12.8 C11.8,11 11.8,8.2 13.6,6.4 L20,0 L26.4,6.4 C28.1,8.2 28.1,11 26.4,12.8 Z",
  },
  {
    key: "e",
    d: "M40,20 L33.5,26.4 C31.8,28.1 29,28.1 27.2,26.4 L20.8,20 L27.2,13.6 C29,11.8 31.8,11.8 33.5,13.6 Z",
  },
  {
    key: "s",
    d: "M20,40 L13.6,33.5 C11.8,31.8 11.8,29 13.6,27.2 L20,20.8 L26.4,27.2 C28.1,29 28.1,31.8 26.4,33.5 Z",
  },
  {
    key: "w",
    d: "M19.2,20 L12.8,26.4 C11,28.1 8.2,28.1 6.4,26.4 L0,20 L6.4,13.6 C8.2,11.8 11,11.8 12.8,13.6 Z",
  },
] as const;

interface AccordionRowProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function AccordionRow({ item, isOpen, onToggle, isLast }: AccordionRowProps) {
  const gradientId = `lotus-gradient-${item.id}`;

  return (
    <div className={cn("accordion-item", !isLast && "border-b border-border")}>
      <button
        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
        aria-controls={`panel-${item.id}`}
        onClick={onToggle}
      >
        <span
          className="font-serif text-[1.0625rem] font-light transition-colors duration-200 group-hover:text-[#d4a54a]"
          style={{ color: isOpen ? "#d4a54a" : undefined }}
        >
          {item.title}
        </span>

        <span
          className="flex-shrink-0 text-[var(--color-dim)] transition-colors duration-200 group-hover:text-[#d4a54a]"
          aria-hidden="true"
          style={{ width: "1.5rem", height: "1.5rem" }}
        >
          <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <radialGradient
                id={gradientId}
                cx="20"
                cy="20"
                r="20"
                fx="20"
                fy="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#d4a54a" />
                <stop offset="100%" stopColor="#fde68a" />
              </radialGradient>
            </defs>

            {/* Chevron — S-Tier: transform + opacity via Motion WAAPI */}
            <motion.path
              d="M12 16 L20 24 L28 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
              animate={
                isOpen
                  ? { rotate: 180, scale: 0.5, opacity: 0 }
                  : { rotate: 0, scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Lotus petals — S-Tier: transform + opacity via Motion WAAPI */}
            {PETALS.map(({ key, d }, i) => (
              <motion.path
                key={key}
                d={d}
                fill={`url(#${gradientId})`}
                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: isOpen ? PETAL_OPEN_DELAYS[i] : PETAL_CLOSE_DELAYS[i],
                }}
              />
            ))}
          </svg>
        </span>
      </button>

      {/* Content panel — height: auto, Motion measures once then animates pixel value */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`panel-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            style={{ overflow: "hidden" }}
          >
            <motion.p
              className="pb-5 text-sm leading-relaxed text-muted"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
            >
              {item.content}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LotusAccordion({ items, className }: LotusAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
