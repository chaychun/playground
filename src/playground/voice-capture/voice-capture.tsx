"use client";

import {
  MicrophoneIcon,
  HouseIcon,
  LinkIcon,
  BookmarkSimpleIcon,
  UserIcon,
  XIcon,
  PauseIcon,
  PlayIcon,
  ArrowUpIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const NAV_ICONS = [
  { key: "home", icon: HouseIcon, label: "Home" },
  { key: "link", icon: LinkIcon, label: "Links" },
  { key: "mic", icon: MicrophoneIcon, label: "Record" },
  { key: "bookmark", icon: BookmarkSimpleIcon, label: "Saved" },
  { key: "profile", icon: UserIcon, label: "Profile" },
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
  const phoneRef = useRef<HTMLDivElement>(null);
  const [phoneWidth, setPhoneWidth] = useState(375);

  useLayoutEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    setPhoneWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setPhoneWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Derive pill/panel positions from actual rendered phone width
  const pillLeft = phoneWidth / 2 - 32;
  const expandedX = 16 - pillLeft;
  const expandedWidth = phoneWidth - 32;

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
    <div className="flex w-full items-center justify-center py-12">
      <div className="flex w-full flex-col items-center gap-4">
        <div className="relative w-full max-w-[375px]">
          {/* Top fade — hides top border radius and shadow */}
          <div className="pointer-events-none absolute -inset-x-8 -top-6 z-10 h-28 bg-[linear-gradient(to_bottom,var(--color-paper)_55%,transparent)]" />

          <MotionConfig transition={PANEL_SPRING}>
            {/* Phone frame — minimal bottom portion */}
            <div
              ref={phoneRef}
              className="w-full overflow-hidden rounded-[2rem] border-2 border-border bg-paper shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]"
            >
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
                  style={{ left: pillLeft, top: 8 }}
                  initial={false}
                  animate={
                    isExpanded
                      ? {
                          x: expandedX,
                          y: -168,
                          width: expandedWidth,
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
                    <MicrophoneIcon className="h-5 w-5 text-ink-inv" />
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
                              <XIcon className="h-5 w-5" />
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
                                    <PlayIcon className="h-5 w-5" weight="fill" />
                                  ) : (
                                    <PauseIcon className="h-5 w-5" weight="fill" />
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
                              <ArrowUpIcon className="h-5 w-5" />
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
