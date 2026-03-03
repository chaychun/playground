"use client";

import { motion, MotionConfig } from "motion/react";
import { useState } from "react";

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V19a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4V4z" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

const NAV_ICONS = [
  { key: "home", icon: HomeIcon, label: "Home" },
  { key: "link", icon: LinkIcon, label: "Links" },
  { key: "mic", icon: MicIcon, label: "Record" },
  { key: "bookmark", icon: BookmarkIcon, label: "Saved" },
  { key: "profile", icon: ProfileIcon, label: "Profile" },
];

const BARS = [
  { id: "a", h: 0.3 },
  { id: "b", h: 0.6 },
  { id: "c", h: 0.45 },
  { id: "d", h: 0.8 },
  { id: "e", h: 0.5 },
  { id: "f", h: 0.7 },
  { id: "g", h: 0.35 },
  { id: "h", h: 0.9 },
  { id: "i", h: 0.55 },
  { id: "j", h: 0.4 },
  { id: "k", h: 0.75 },
  { id: "l", h: 0.6 },
];

function VisualizationPlaceholder() {
  return (
    <div className="flex h-16 items-end justify-center gap-[3px] px-4">
      {BARS.map(({ id, h }) => (
        <div
          key={id}
          className="w-1.5 rounded-full bg-ink-inv/30"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}

const SLOW = 5;

export default function VoiceCapture() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [slow, setSlow] = useState(false);
  const t = slow ? SLOW : 1;

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.35 * t, bounce: 0.1 }}>
      <div className="flex h-full w-full items-center justify-center bg-surface">
        {/* Phone frame — minimal bottom portion */}
        <div className="w-[375px] overflow-hidden rounded-[2rem] border border-border bg-paper shadow-lg">
          {/* Screen content area — just enough to suggest a phone */}
          <div className="relative h-48">
            <button
              className="absolute top-3 right-3 rounded-full border border-ink-inv/10 bg-ink-inv/5 px-2.5 py-1 font-mono text-2xs text-muted transition-colors hover:bg-ink-inv/10"
              onClick={() => setSlow((s) => !s)}
            >
              {slow ? "0.2x" : "1x"}
            </button>
          </div>

          {/* Navigation bar area */}
          <div className="relative px-4 pb-6">
            {/* Nav items row */}
            <nav className="flex h-16 items-center justify-around">
              {NAV_ICONS.map(({ key, icon: Icon, label }) => {
                if (key === "mic") {
                  return <div key={key} className="h-12 w-16" />;
                }

                return (
                  <motion.button
                    key={key}
                    className="flex h-12 w-12 items-center justify-center"
                    animate={{
                      opacity: isExpanded ? 0.15 : 1,
                      filter: isExpanded ? "blur(4px)" : "blur(0px)",
                    }}
                    aria-label={label}
                  >
                    <Icon className="h-6 w-6 text-muted" />
                  </motion.button>
                );
              })}
            </nav>

            {/* Voice pill / expanded pane — single element, CSS-animated */}
            <motion.div
              className="absolute z-20 overflow-hidden bg-ink"
              style={{ left: 155.5, top: 8 }}
              animate={
                isExpanded
                  ? { x: -139.5, y: -168, width: 343, height: 224, borderRadius: 20 }
                  : { x: 0, y: 0, width: 64, height: 48, borderRadius: 24 }
              }
              onClick={() => !isExpanded && setIsExpanded(true)}
              aria-label={isExpanded ? undefined : "Open voice capture"}
              role={isExpanded ? undefined : "button"}
            >
              {/* Mic icon — visible when collapsed */}
              <motion.div
                className="absolute inset-0 flex cursor-pointer items-center justify-center"
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  filter: isExpanded ? "blur(4px)" : "blur(0px)",
                }}
                transition={{
                  duration: isExpanded ? 0.05 * t : 0.1 * t,
                  delay: isExpanded ? 0 : 0.15 * t,
                }}
              >
                <MicIcon className="h-5 w-5 text-ink-inv" />
              </motion.div>

              {/* Expanded content — visible when expanded */}
              <motion.div
                className="flex h-full flex-col items-center justify-between px-6 py-5"
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  filter: isExpanded ? "blur(0px)" : "blur(6px)",
                }}
                transition={{
                  duration: isExpanded ? 0.25 * t : 0.1 * t,
                  delay: isExpanded ? 0.1 * t : 0,
                }}
                style={{ pointerEvents: isExpanded ? "auto" : "none" }}
              >
                {/* Visualization area */}
                <VisualizationPlaceholder />

                {/* Action buttons */}
                <div className="flex w-full items-center justify-center gap-6">
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-inv/15 text-ink-inv transition-colors hover:bg-ink-inv/25"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Cancel recording"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>

                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-inv/20 text-ink-inv transition-colors hover:bg-ink-inv/30"
                    aria-label="Pause recording"
                  >
                    <PauseIcon className="h-5 w-5" />
                  </button>

                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-inv text-ink transition-colors hover:bg-ink-inv/90"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Send recording"
                  >
                    <SendIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
