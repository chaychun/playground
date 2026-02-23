"use client";

import { cn } from "@/lib/cn";
import { Info, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface InfoModalProps {
  title: string;
  description: string;
  details?: string[];
}

function InfoModal({ title, description, details }: InfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
        className="pointer-events-auto flex items-center justify-center"
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
          style={{ borderRadius: isOpen ? "16px" : "28px" }}
        >
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                key="content"
                className="min-h-0 flex-1 overflow-y-auto"
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.2, duration: 0.4 },
                }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.1 } }}
              >
                <div className="px-6 pt-6 pb-0">
                  <motion.h1 className="mt-4 text-2xl font-medium text-ink" layout>
                    {title}
                  </motion.h1>
                  <motion.p className="mt-2 text-sm leading-snug text-muted" layout>
                    {description}
                  </motion.p>

                  <AnimatePresence mode="popLayout">
                    {showDetails && details && (
                      <motion.div
                        key="details"
                        className="mt-5"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      >
                        <ul className="flex flex-col gap-2 text-sm text-dim">
                          {details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {details && !showDetails && (
                    <div className="mt-5 mb-4 flex justify-center">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetails(true);
                        }}
                        className="flex cursor-pointer flex-col items-center text-sm font-light text-muted hover:text-dim"
                        layout
                      >
                        <span>Show more</span>
                        <span className="text-xs">&#x25BE;</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
          >
            {isOpen ? (
              <X className="h-6 w-6 text-muted" weight="light" />
            ) : (
              <Info className="h-6 w-6 text-muted" weight="light" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default function InfoModalDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface p-6">
      <InfoModal
        title="Spring Physics"
        description="An exploration of spring-based animations and how natural motion curves create more organic, lifelike interfaces."
        details={[
          "Built with motion/react spring animations",
          "Configurable stiffness, damping, and mass",
          "Interactive playground with real-time preview",
        ]}
      />
    </div>
  );
}
