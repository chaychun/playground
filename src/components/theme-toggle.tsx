"use client";

import { cn } from "@/lib/cn";
import { Moon, Monitor, Sun } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEME_CYCLE = ["system", "light", "dark"] as const;

export function ThemeToggle({
  className,
  iconSize = "size-3.5",
}: {
  className?: string;
  iconSize?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(theme as (typeof THEME_CYCLE)[number]);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  };

  if (!mounted) {
    return <div className={cn("size-6", className)} />;
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative flex size-6 items-center justify-center text-muted transition-colors hover:text-ink",
        className,
      )}
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "light" && <Sun className={iconSize} />}
          {theme === "dark" && <Moon className={iconSize} />}
          {theme === "system" && <Monitor className={iconSize} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
