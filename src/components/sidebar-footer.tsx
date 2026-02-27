"use client";

import { TextEffect } from "@/components/text-effect";
import { XLogo, GithubLogo, EnvelopeSimple, Sun, Moon, Monitor } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const SOCIAL_LINKS = [
  {
    icon: XLogo,
    href: "https://x.com/chunchayut",
    label: "X (Twitter)",
    prefix: "/",
    username: "chunchayut",
  },
  {
    icon: GithubLogo,
    href: "https://github.com/chaychun",
    label: "GitHub",
    prefix: "/",
    username: "chaychun",
  },
  {
    icon: EnvelopeSimple,
    href: "mailto:chun.chayut@gmail.com",
    label: "Email",
    prefix: " ",
    username: "chun.chayut@gmail.com",
  },
] as const;

const springTransition = {
  type: "spring",
  duration: 0.5,
  bounce: 0,
} as const;

function SocialLink({ link }: { link: (typeof SOCIAL_LINKS)[number] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="-m-1.5 flex items-center p-1.5 text-muted transition-colors hover:text-ink"
      aria-label={link.label}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <link.icon className="size-3.5 shrink-0" />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={springTransition}
            className="overflow-hidden text-xs whitespace-nowrap"
          >
            <span className="ml-1">{link.prefix}</span>
            <TextEffect
              per="char"
              preset="fade"
              trigger={isHovered}
              speedReveal={2}
              segmentTransition={springTransition}
              className="inline"
            >
              {link.username}
            </TextEffect>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

const THEME_CYCLE = ["system", "light", "dark"] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(theme as (typeof THEME_CYCLE)[number]);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  };

  const iconVariants = {
    initial: { scale: 0.6, rotate: -45, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.6, rotate: 45, opacity: 0 },
  };

  if (!mounted) {
    return <div className="size-6" />;
  }

  return (
    <button
      onClick={cycleTheme}
      className="relative flex size-6 items-center justify-center rounded-md text-muted transition-colors hover:text-ink"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {theme === "light" && <Sun className="size-3.5" />}
          {theme === "dark" && <Moon className="size-3.5" />}
          {theme === "system" && <Monitor className="size-3.5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function SidebarFooter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        {SOCIAL_LINKS.map((link) => (
          <SocialLink key={link.label} link={link} />
        ))}
      </div>
      <ThemeToggle />
    </div>
  );
}
