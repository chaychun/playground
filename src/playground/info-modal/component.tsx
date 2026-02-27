"use client";

import { cn } from "@/lib/cn";
import { CaretDown, Info, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface InfoModalProps {
  label?: string;
  title: string;
  artist: string;
  body: string;
  details?: string[];
}

function InfoModal({ label, title, artist, body, details }: InfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLayoutAnimating, setIsLayoutAnimating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) setShowDetails(false);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowDetails(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setIsOpen(false);
        setShowDetails(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [isOpen]);

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0 }}>
      <div
        className="pointer-events-auto flex h-full w-full items-end justify-end"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
      >
        <motion.div
          className={cn(
            "relative overflow-hidden bg-paper",
            isOpen
              ? "flex max-h-[calc(100%-32px)] w-[min(380px,calc(100%-32px))] flex-col"
              : "h-14 w-14",
          )}
          layout
          ref={panelRef}
          animate={{ borderRadius: isOpen ? "16px" : "28px" }}
          onLayoutAnimationStart={() => setIsLayoutAnimating(true)}
          onLayoutAnimationComplete={() => setIsLayoutAnimating(false)}
        >
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                key="content"
                className={cn(
                  "min-h-0 flex-1",
                  isLayoutAnimating ? "overflow-hidden" : "overflow-y-auto",
                )}
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2, duration: 0.4 },
                }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.1 } }}
              >
                <div className="px-6 pt-6 pb-18">
                  {label && (
                    <motion.span
                      className="mb-4 inline-block font-mono text-2xs font-medium tracking-widest text-muted uppercase"
                      layout
                    >
                      {label}
                    </motion.span>
                  )}

                  <motion.h1 className="text-2xl leading-tight font-medium text-ink" layout>
                    {title}
                  </motion.h1>

                  <motion.p className="mt-1 font-mono text-xs text-muted" layout>
                    {artist}
                  </motion.p>

                  <AnimatePresence mode="popLayout">
                    {showDetails && (
                      <motion.div
                        key="expanded"
                        className="mt-4"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <div className="h-px bg-border" />

                        <p className="mt-4 text-sm leading-relaxed text-dim">{body}</p>

                        {details && (
                          <>
                            <div className="mt-4 h-px bg-border" />
                            <ul className="mt-3 flex flex-col gap-1.5">
                              {details.map((detail) => (
                                <li key={detail} className="font-mono text-2xs text-muted">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isOpen && !showDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              className="absolute bottom-0 left-0 flex h-14 cursor-pointer items-center gap-1.5 px-6 font-mono text-2xs font-medium tracking-widest text-muted uppercase hover:text-dim"
            >
              <span>Read more</span>
              <CaretDown className="h-3 w-3" weight="bold" />
            </button>
          )}

          <motion.button
            aria-label={isOpen ? "Close info modal" : "Open info modal"}
            aria-expanded={isOpen}
            className={cn(
              "flex h-14 w-14 cursor-pointer items-center justify-center text-ink",
              isOpen ? "absolute right-0 bottom-0" : "",
            )}
            onClick={toggleModal}
            whileTap={{ scale: 0.9 }}
            layout
            {...(showDetails && {
              transition: { layout: { duration: 0 } },
            })}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="h-6 w-6 text-muted" weight="light" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Info className="h-6 w-6 text-muted" weight="light" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default function InfoModalDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/images/near-glarus.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative h-full w-full p-4">
        <InfoModal
          label="About this piece"
          title="Near Glarus, Switzerland"
          artist="John Warwick Smith, 1781"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Maecenas faucibus mollis interdum."
          details={["Watercolor on laid paper", "38 × 52 cm", "Private collection, on loan"]}
        />
      </div>
    </div>
  );
}
