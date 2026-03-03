"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";

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

function PlayIcon({ className }: { className?: string }) {
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
      <polygon points="6,4 20,12 6,20" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path
        d="M4 12l6 6L20 6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ type: "spring", visualDuration: 0.4, bounce: 0 }}
      />
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

const BAR_KEYS = ["a", "b", "c", "d", "e", "f", "g"];
const BAR_MIN_H = 12;
const BAR_MAX_H = 108;
const BAR_INTERVAL = 150;
const BAR_WIDTH = 28;
const BAR_GAP = 8;
const BAR_SPRING = { type: "spring" as const, visualDuration: 0.3, bounce: 0 };

function AudioVisualizer({ paused }: { paused: boolean }) {
  const [bars, setBars] = useState(() => BAR_KEYS.map((key) => ({ key, h: BAR_MIN_H })));

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map((bar) => ({
          ...bar,
          h: BAR_MIN_H + Math.random() * (BAR_MAX_H - BAR_MIN_H),
        })),
      );
    }, BAR_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="flex flex-1 items-center justify-center" style={{ gap: BAR_GAP }}>
      {bars.map(({ key, h }) => (
        <motion.div
          key={key}
          className="rounded-full bg-ink-inv/30"
          animate={{ height: h }}
          transition={BAR_SPRING}
          style={{ width: BAR_WIDTH }}
        />
      ))}
    </div>
  );
}

const PANEL_SPRING = { type: "spring" as const, visualDuration: 0.4, bounce: 0.1 };
const SCALE_SPRING = { type: "spring" as const, duration: 0.15, bounce: 0 };
const TAP = { scale: 0.9, transition: SCALE_SPRING };
const TAP_PILL = { scale: 0.95, transition: SCALE_SPRING };
const PANEL_TAP_SPRING = { ...PANEL_SPRING, scale: SCALE_SPRING };

const SUCCESS_DELAY = 1400;
const SUCCESS_SCALE_FROM = 0.3;
const SUCCESS_SCALE_SPRING = { type: "spring" as const, visualDuration: 0.3, bounce: 0.4 };
const SUCCESS_FADE = 0.2;

const FADE_CONTENT_IN = 0.25;
const FADE_CONTENT_OUT = 0.1;
const FADE_CONTENT_IN_DELAY = 0.1;
const FADE_MIC_OUT = 0.05;
const FADE_MIC_IN = 0.1;
const FADE_MIC_IN_DELAY = 0.15;

export default function VoiceCapture() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = useCallback(() => {
    setSent(true);
    setPaused(true);
  }, []);

  useEffect(() => {
    if (!sent) return;
    const timeout = setTimeout(() => {
      setIsExpanded(false);
      setSent(false);
      setPaused(false);
    }, SUCCESS_DELAY);
    return () => clearTimeout(timeout);
  }, [sent]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Top fade — hides top border radius and shadow */}
          <div className="pointer-events-none absolute -inset-x-8 -top-6 z-10 h-28 bg-[linear-gradient(to_bottom,var(--color-surface)_55%,transparent)]" />

          <MotionConfig transition={PANEL_SPRING}>
            {/* Phone frame — minimal bottom portion */}
            <div className="w-[375px] overflow-hidden rounded-[2rem] border border-border bg-paper shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              {/* Screen content area — just enough to suggest a phone */}
              <div className="h-72" />

              {/* Navigation bar area */}
              <div className="relative px-4 pb-4">
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
                        whileTap={TAP}
                        transition={PANEL_TAP_SPRING}
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
                      ? {
                          x: -139.5,
                          y: -168,
                          width: 343,
                          height: 224,
                          borderRadius: 16,
                        }
                      : { x: 0, y: 0, width: 64, height: 48, borderRadius: 24 }
                  }
                  whileTap={isExpanded ? undefined : TAP_PILL}
                  transition={PANEL_TAP_SPRING}
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
                      duration: isExpanded ? FADE_MIC_OUT : FADE_MIC_IN,
                      delay: isExpanded ? 0 : FADE_MIC_IN_DELAY,
                    }}
                  >
                    <MicIcon className="h-5 w-5 text-ink-inv" />
                  </motion.div>

                  {/* Expanded content — visible when expanded */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      filter: isExpanded ? "blur(0px)" : "blur(6px)",
                    }}
                    transition={{
                      duration: isExpanded ? FADE_CONTENT_IN : FADE_CONTENT_OUT,
                      delay: isExpanded ? FADE_CONTENT_IN_DELAY : 0,
                    }}
                    style={{ pointerEvents: isExpanded ? "auto" : "none" }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {sent ? (
                        <motion.div
                          key="success"
                          className="flex h-full items-center justify-center"
                          initial={{ opacity: 0, filter: "blur(6px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(6px)" }}
                          transition={{ duration: SUCCESS_FADE }}
                        >
                          <motion.div
                            initial={{ scale: SUCCESS_SCALE_FROM }}
                            animate={{ scale: 1 }}
                            transition={SUCCESS_SCALE_SPRING}
                          >
                            <CheckIcon className="h-10 w-10 text-ink-inv" />
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="recording"
                          className="flex h-full flex-col items-center justify-end gap-4 px-6 pb-5"
                          initial={{ opacity: 0, filter: "blur(6px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(6px)" }}
                          transition={{ duration: FADE_CONTENT_OUT }}
                        >
                          {/* Visualization area */}
                          <AudioVisualizer paused={paused} />

                          {/* Action buttons */}
                          <div className="flex w-full items-center justify-center gap-6">
                            <motion.button
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-inv/15 text-ink-inv transition-colors hover:bg-ink-inv/25"
                              whileTap={TAP}
                              transition={PANEL_TAP_SPRING}
                              onClick={() => {
                                setIsExpanded(false);
                                setPaused(false);
                              }}
                              aria-label="Cancel recording"
                            >
                              <CloseIcon className="h-5 w-5" />
                            </motion.button>

                            <motion.button
                              className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ink-inv/20 text-ink-inv transition-colors hover:bg-ink-inv/30"
                              whileTap={TAP}
                              transition={PANEL_TAP_SPRING}
                              onClick={() => setPaused((p) => !p)}
                              aria-label={paused ? "Resume recording" : "Pause recording"}
                            >
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                  key={paused ? "play" : "pause"}
                                  className="flex items-center justify-center"
                                  initial={{ opacity: 0, filter: "blur(4px)" }}
                                  animate={{ opacity: 1, filter: "blur(0px)" }}
                                  exit={{ opacity: 0, filter: "blur(4px)" }}
                                  transition={{ duration: 0.1 }}
                                >
                                  {paused ? (
                                    <PlayIcon className="h-5 w-5" />
                                  ) : (
                                    <PauseIcon className="h-5 w-5" />
                                  )}
                                </motion.span>
                              </AnimatePresence>
                            </motion.button>

                            <motion.button
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-inv text-ink transition-colors hover:bg-ink-inv/90"
                              whileTap={TAP}
                              transition={PANEL_TAP_SPRING}
                              onClick={handleSend}
                              aria-label="Send recording"
                            >
                              <SendIcon className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </MotionConfig>
        </div>
      </div>
    </div>
  );
}
