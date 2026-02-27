"use client";

import { cn } from "@/lib/cn";
import { Sun, Moon, Monitor } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Experiments" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
];

const THEME_CYCLE = ["system", "light", "dark"] as const;

function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(theme as (typeof THEME_CYCLE)[number]);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  };

  if (!mounted) {
    return <div className="size-5" />;
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex size-5 items-center justify-center text-muted transition-colors hover:text-ink"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {theme === "light" && <Sun className="size-3.5" />}
          {theme === "dark" && <Moon className="size-3.5" />}
          {theme === "system" && <Monitor className="size-3.5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function MobileHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-border bg-paper/90 px-5 backdrop-blur-md lg:hidden">
      <Link href="/" className="text-sm font-semibold tracking-tight text-ink">
        Chayut C.
      </Link>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-3">
          {links.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-xs transition-colors",
                  isActive ? "font-medium text-ink" : "text-muted hover:text-link",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="h-3 w-px bg-border" />
        <MobileThemeToggle />
      </div>
    </header>
  );
}
