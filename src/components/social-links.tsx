"use client";

import { TextEffect } from "@/components/text-effect";
import { SOCIAL_LINKS } from "@/data/social";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SOCIAL_LINK_DETAILS = SOCIAL_LINKS.map((link) => {
  const extra = {
    Threads: { display: "Threads" },
    GitHub: { display: "GitHub" },
    Email: { display: "chun.chayut@gmail.com" },
  } as const;
  return { ...link, ...extra[link.label] };
});

const springTransition = {
  type: "spring",
  duration: 0.5,
  bounce: 0,
} as const;

function SocialLink({ link }: { link: (typeof SOCIAL_LINK_DETAILS)[number] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.label === "Email" ? undefined : "_blank"}
      rel={link.label === "Email" ? undefined : "noopener noreferrer"}
      className="-m-1.5 flex h-[1em] items-center p-1.5 text-body text-muted transition-colors hover:text-ink [&:hover>.social-icon]:text-accent/60"
      aria-label={link.label}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <link.icon className="social-icon size-[1.2em] shrink-0 transition-colors" />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={springTransition}
            className="inline-flex items-center overflow-hidden whitespace-nowrap"
          >
            <TextEffect
              as="span"
              per="char"
              preset="fade"
              trigger={isHovered}
              speedReveal={2}
              segmentTransition={springTransition}
              className="ml-1.5 inline"
            >
              {link.display}
            </TextEffect>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIAL_LINK_DETAILS.map((link) => (
        <SocialLink key={link.label} link={link} />
      ))}
    </div>
  );
}
