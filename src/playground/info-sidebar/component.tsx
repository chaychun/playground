"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCallback, useRef, useState } from "react";

export default function InfoSidebarDemo() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const sidebarRef = useRef<HTMLElement>(null);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleSidebarClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (isCollapsed) setIsCollapsed(false);
    },
    [isCollapsed],
  );

  const handleContainerDismiss = useCallback(() => {
    if (!isCollapsed) setIsCollapsed(true);
  }, [isCollapsed]);

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsCollapsed(true);
  }, []);

  const defaultTransition = {
    type: "spring" as const,
    duration: 0.8,
    bounce: 0,
  };

  return (
    <MotionConfig transition={defaultTransition}>
      <div
        role="presentation"
        className="relative h-full w-full overflow-hidden"
        onClick={handleContainerDismiss}
        onKeyDown={handleContainerKeyDown}
      >
        {/* Background content hint */}
        <div className="flex h-full w-full items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <p className="font-mono text-2xs tracking-widest text-muted uppercase">
              Main Content Area
            </p>
            <p className="mt-2 text-sm text-mid">
              Click the sidebar or arrow to expand. Click outside to collapse.
            </p>
          </div>
        </div>

        <motion.aside
          ref={sidebarRef}
          role="complementary"
          onClick={handleSidebarClick}
          className="absolute top-0 bottom-0 left-0 z-10 overflow-hidden bg-surface"
          initial={{ width: 56 }}
          animate={{ width: isCollapsed ? 56 : 360 }}
        >
          <AnimatePresence mode="popLayout">
            {isCollapsed ? (
              <motion.div
                className="pointer-events-none absolute inset-0 flex h-full w-[56px] flex-col items-center p-4 select-none"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                key="collapsed"
              >
                <h1 className="flex-1 text-center text-lg font-medium text-ink [writing-mode:vertical-lr]">
                  Elastic Motion
                </h1>
                <motion.button
                  onClick={toggleCollapsed}
                  aria-label="Expand sidebar"
                  type="button"
                  className="pointer-events-auto cursor-pointer"
                >
                  <ArrowRight className="h-5 w-5 text-muted" weight="thin" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="absolute inset-0 flex h-full flex-col items-center justify-between p-4"
                style={{ width: 360 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="expanded"
              >
                <div className="flex flex-1 flex-col justify-between pt-16">
                  <div>
                    <h1 className="text-3xl font-bold text-ink">Elastic Motion</h1>
                    <p className="mt-2 text-sm text-muted">
                      Spring-driven animations that feel natural and responsive. Each interaction is
                      powered by configurable physics parameters.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-dim">
                    <p>Stiffness controls how rigid the spring feels.</p>
                    <p>Damping determines how quickly oscillation settles.</p>
                    <p>Mass affects the weight of the animated element.</p>
                  </div>

                  <div className="relative">
                    <motion.button
                      onClick={toggleCollapsed}
                      aria-label="Collapse sidebar"
                      type="button"
                      className="absolute right-0 bottom-0 cursor-pointer"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                    >
                      <ArrowLeft className="h-5 w-5 text-muted" weight="thin" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </div>
    </MotionConfig>
  );
}
