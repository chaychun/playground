"use client";

import { scaleTransition, useSpeed } from "@/lib/speed-context";
import { ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function FloatingLabelDemo() {
  const factor = useSpeed();
  const id = "floating-label-input";
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const [prefixWidth, setPrefixWidth] = useState(0);

  const isFloating = focused || value.length > 0 || submittedName !== null;

  useEffect(() => {
    if (prefixRef.current) {
      setPrefixWidth(prefixRef.current.getBoundingClientRect().width);
    }
  }, []);

  function submit() {
    if (!value.length) return;
    setSubmittedName(value);
    setValue("");
  }

  useEffect(() => {
    if (!submittedName) return;
    const t = setTimeout(() => {
      setSubmittedName(null);
      inputRef.current?.blur();
    }, 2800 / factor);
    return () => clearTimeout(t);
  }, [submittedName, factor]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="relative w-full max-w-xs">
        <motion.label
          htmlFor={id}
          initial={false}
          animate={
            isFloating
              ? { y: 0, fontSize: "0.7rem", color: focused ? "var(--accent)" : "var(--muted)" }
              : { y: 20, fontSize: "1rem", color: "var(--dim)" }
          }
          transition={scaleTransition({ type: "spring", stiffness: 400, damping: 32 }, factor)}
          className="pointer-events-none absolute top-0 left-0 origin-left font-sans leading-none select-none"
        >
          Your name
        </motion.label>

        <div className="flex items-end gap-2">
          <div className="relative min-w-0 flex-1 overflow-hidden">
            {/* Always-rendered prefix used only for measuring its width */}
            <span
              ref={prefixRef}
              aria-hidden={true}
              className="pointer-events-none invisible absolute text-base whitespace-nowrap"
            >
              Nice to meet you,&nbsp;
            </span>

            <input
              id={id}
              type="text"
              value={value}
              ref={inputRef}
              readOnly={!!submittedName}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="w-full bg-transparent pt-5 pb-1.5 text-base text-ink outline-none"
              style={{ caretColor: submittedName ? "transparent" : undefined }}
            />

            <AnimatePresence>
              {submittedName && (
                <motion.div
                  exit={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                  transition={scaleTransition(
                    {
                      type: "spring",
                      stiffness: 280,
                      damping: 30,
                      filter: { duration: 0.2 },
                    },
                    factor,
                  )}
                  className="pointer-events-none absolute inset-0 overflow-hidden text-base text-ink"
                >
                  {/* Name: slides right, no blur */}
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: prefixWidth }}
                    transition={scaleTransition(
                      { type: "spring", stiffness: 280, damping: 30 },
                      factor,
                    )}
                    className="absolute bottom-1.5 left-0 min-w-0 truncate"
                    style={{ maxWidth: `calc(100% - ${prefixWidth}px)` }}
                  >
                    {submittedName}
                  </motion.span>
                  {/* Prefix: enters from bottom with blur */}
                  <motion.span
                    initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={scaleTransition(
                      {
                        type: "spring",
                        stiffness: 280,
                        damping: 30,
                        delay: 0.15,
                        filter: { duration: 0.2, delay: 0.15 },
                      },
                      factor,
                    )}
                    className="absolute bottom-1.5 left-0 whitespace-nowrap"
                  >
                    Nice to meet you,&nbsp;
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {submittedName ? (
              <motion.span
                key="wave"
                initial={{ scale: 0.4, opacity: 0, filter: "blur(4px)" }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                }}
                exit={{ scale: 0.4, opacity: 0, filter: "blur(4px)" }}
                transition={scaleTransition(
                  {
                    scale: { type: "spring", stiffness: 400, damping: 28 },
                    filter: { duration: 0.2 },
                    opacity: { duration: 0.15 },
                    rotate: {
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                      ease: "easeInOut",
                    },
                  },
                  factor,
                )}
                style={{ transformOrigin: "70% 70%" }}
                className="mb-1.5 text-xl leading-none"
              >
                👋
              </motion.span>
            ) : value.length > 0 ? (
              <motion.button
                key="arrow"
                type="button"
                initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                transition={scaleTransition(
                  {
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    filter: { duration: 0.2 },
                  },
                  factor,
                )}
                onClick={submit}
                className="mb-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-paper"
              >
                <ArrowRight size={14} weight="bold" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div className="h-px w-full bg-border" />
          <motion.div
            initial={false}
            animate={{ opacity: focused ? 1 : 0 }}
            transition={scaleTransition({ duration: 0.2 }, factor)}
            className="absolute inset-0 h-px bg-accent"
          />
        </div>
      </div>
    </div>
  );
}
