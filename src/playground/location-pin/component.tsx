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
      <div className="relative flex items-start justify-center">
        <motion.div
          layout
          className={cn(
            "relative overflow-hidden bg-paper",
            isOpen
              ? "absolute -bottom-4 left-1/2 z-50 w-72 -translate-x-1/2 -translate-y-full cursor-default rounded-2xl"
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
          onHoverStart={() => !isOpen && setIsHovered(true)}
          onHoverEnd={() => !isOpen && setIsHovered(false)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={!isOpen ? { scale: 1.1, transformOrigin: "bottom center" } : {}}
        >
          <motion.div
            layout
            className={cn("overflow-hidden", isOpen ? "h-[180px] w-full" : "h-full w-full")}
            style={isOpen ? { borderRadius: "0px" } : { borderRadius: "30px" }}
          >
            <img src={location.image} alt={location.name} className="h-full w-full object-cover" />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                className="p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className="m-0 mb-2 text-xl font-semibold text-ink">{location.name}</h2>
                <p className="m-0 mb-4 text-sm leading-relaxed text-muted">
                  {location.description}
                </p>
                <button
                  className="cursor-pointer rounded-lg border-none bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-border active:scale-95"
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

        <div className="absolute top-[58px] left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-t-[12px] border-r-[8px] border-l-[8px] border-t-paper border-r-transparent border-l-transparent" />

        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 -translate-y-2 rounded-lg bg-ink px-3 py-1.5 text-sm font-medium whitespace-nowrap text-ink-inv shadow-lg"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {location.name}
            </motion.div>
          )}
        </AnimatePresence>
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
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop"
          alt="Mountain landscape"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute top-[70%] left-1/2 -translate-x-1/2">
          <LocationPin location={DEMO_LOCATION} />
        </div>
      </div>
    </div>
  );
}
