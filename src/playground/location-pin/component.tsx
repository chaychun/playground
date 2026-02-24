"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useState } from "react";

interface Location {
  name: string;
  image: string;
  description: string;
}

function LocationPin({ location }: { location: Location }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.4, bounce: 0 }}>
      <div className="relative flex flex-col items-center">
        {/* Morphing container — always in flow, never absolute */}
        <motion.div
          layout
          className={cn(
            "relative overflow-hidden bg-paper",
            isOpen
              ? "z-50 w-56 cursor-default"
              : "group z-20 flex h-[60px] w-[60px] cursor-pointer items-center justify-center p-1",
          )}
          style={{
            transformOrigin: "bottom center",
            borderRadius: isOpen ? "16px" : "30px",
          }}
          onClick={() => {
            if (!isOpen) {
              setIsHovered(false);
              setIsOpen(true);
            }
          }}
          onPointerEnter={() => !isOpen && setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={!isOpen ? { scale: 1.1, transformOrigin: "bottom center" } : {}}
        >
          {/* Image container */}
          <motion.div
            layout
            className={cn("overflow-hidden", isOpen ? "h-[140px] w-full" : "h-full w-full")}
            style={isOpen ? { borderRadius: "0px" } : { borderRadius: "30px" }}
          >
            <img src={location.image} alt={location.name} className="h-full w-full object-cover" />
          </motion.div>

          {/* Expanded content */}
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className="m-0 mb-1.5 text-base font-semibold text-ink">{location.name}</h2>
                <p className="m-0 mb-3 text-xs leading-relaxed text-muted">
                  {location.description}
                </p>
                <button
                  className="cursor-pointer rounded-lg border-none bg-surface px-4 py-2 text-xs font-semibold text-ink transition-all hover:opacity-80 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pin triangle */}
        <div className="z-10 h-0 w-0 border-t-[12px] border-r-[8px] border-l-[8px] border-t-paper border-r-transparent border-l-transparent" />

        {/* Hover tooltip — hard-unmounted when card is open to avoid lingering */}
        {!isOpen && (
          <motion.div
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-lg bg-ink px-3 py-1.5 text-sm font-medium whitespace-nowrap text-ink-inv shadow-lg"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
            transition={{ duration: 0.15 }}
          >
            {location.name}
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}

const DEMO_LOCATION: Location = {
  name: "Dreamy Spot",
  image:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop",
  description:
    "A serene location perfect for relaxation. Crystal clear water and breathtaking mountain backdrop.",
};

export default function LocationPinDemo() {
  return (
    <div className="flex aspect-[3/4] w-full flex-col items-center justify-end pb-[15%]">
      <LocationPin location={DEMO_LOCATION} />
    </div>
  );
}
