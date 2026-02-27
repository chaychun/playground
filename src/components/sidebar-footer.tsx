"use client";

import { TextEffect } from "@/components/text-effect";
import { ThemeToggle } from "@/components/theme-toggle";
import { SOCIAL_LINKS } from "@/data/social";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SIDEBAR_SOCIAL_LINKS = SOCIAL_LINKS.map((link) => {
  const extra = {
    "X (Twitter)": { prefix: "/", username: "chunchayut" },
    GitHub: { prefix: "/", username: "chaychun" },
    Email: { prefix: " ", username: "chun.chayut@gmail.com" },
  } as const;
  return { ...link, ...extra[link.label] };
});

const springTransition = {
  type: "spring",
  duration: 0.5,
  bounce: 0,
} as const;

function SocialLink({ link }: { link: (typeof SIDEBAR_SOCIAL_LINKS)[number] }) {
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

export function SidebarFooter() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        {SIDEBAR_SOCIAL_LINKS.map((link) => (
          <SocialLink key={link.label} link={link} />
        ))}
      </div>
      <ThemeToggle />
    </div>
  );
}
