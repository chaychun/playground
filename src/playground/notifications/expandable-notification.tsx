"use client";

import { cn } from "@/lib/cn";
import { scaleTransition, useSpeedControl } from "@/lib/speed-context";
import { useMeasure } from "@/lib/use-measure";
import {
  ArrowLeftIcon,
  CaretUpIcon,
  PaperPlaneTiltIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  type: "conversation";
  id: number;
  name: string;
  initials: string;
  avatarClass: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

interface CalendarEvent {
  type: "calendar";
  id: number;
  title: string;
  dayName: string;
  dayNum: string;
  timeRange: string;
  timeUntil: string;
  duration: string;
  attendees: Array<{ initials: string; className: string }>;
  organizer: string;
  location: string;
}

type NotificationItem = Conversation | CalendarEvent;

// ─── Data ─────────────────────────────────────────────────────────────────────

const notifications: NotificationItem[] = [
  {
    type: "calendar",
    id: 101,
    title: "Design sync",
    dayName: "MON",
    dayNum: "22",
    timeRange: "3:00 – 3:30 PM",
    timeUntil: "in 15 min",
    duration: "30 min",
    attendees: [
      { initials: "SC", className: "bg-[#1c3345] text-[#6aaed0]" },
      { initials: "MW", className: "bg-[#2a1f3d] text-[#9d85d0]" },
      { initials: "LP", className: "bg-[#1a3024] text-[#70b894]" },
    ],
    organizer: "Sarah Chen",
    location: "Zoom",
  },
  {
    type: "conversation",
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    avatarClass: "bg-[#1c3345] text-[#6aaed0]",
    preview: "are you coming to the meetup thursday?",
    time: "Just now",
    unread: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "hey! did you see the new figma variables update?",
        time: "2:14 PM",
      },
      { id: 2, from: "me", text: "omg yes, finally proper token support", time: "2:16 PM" },
      {
        id: 3,
        from: "them",
        text: "right? i've been waiting for this for like 2 years lol",
        time: "2:16 PM",
      },
      { id: 4, from: "them", text: "are you coming to the meetup thursday?", time: "2:17 PM" },
    ],
  },
  {
    type: "conversation",
    id: 2,
    name: "Marcus Wright",
    initials: "MW",
    avatarClass: "bg-[#2a1f3d] text-[#9d85d0]",
    preview: "also the q2 retro is moved to friday",
    time: "2 min ago",
    unread: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "can you take a look at the PR when you get a chance?",
        time: "1:40 PM",
      },
      { id: 2, from: "me", text: "on it, give me 20 mins", time: "1:42 PM" },
      { id: 3, from: "them", text: "no rush, just before EOD works", time: "1:43 PM" },
      { id: 4, from: "me", text: "left some comments, lgtm overall", time: "2:05 PM" },
      { id: 5, from: "them", text: "perfect, merging now. thanks 🙏", time: "2:07 PM" },
      { id: 6, from: "them", text: "also the q2 retro is moved to friday", time: "2:10 PM" },
    ],
  },
  {
    type: "conversation",
    id: 3,
    name: "Lena Park",
    initials: "LP",
    avatarClass: "bg-[#1a3024] text-[#70b894]",
    preview: "also have you started that book yet?",
    time: "3 hours ago",
    unread: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "the coffee place you recommended was SO good",
        time: "10:22 AM",
      },
      { id: 2, from: "me", text: "told you!! the cortado right?", time: "10:25 AM" },
      { id: 3, from: "them", text: "yes!! and the pastries omg", time: "10:26 AM" },
      { id: 4, from: "them", text: "we should go together sometime", time: "10:26 AM" },
      { id: 5, from: "me", text: "yes please, maybe this weekend?", time: "10:30 AM" },
      { id: 6, from: "them", text: "also have you started that book yet?", time: "10:45 AM" },
    ],
  },
];

const conversations = notifications.filter((n): n is Conversation => n.type === "conversation");

// ─── Conversation avatar ───────────────────────────────────────────────────────

function ConvAvatar({ conv, size = "md" }: { conv: Conversation; size?: "sm" | "md" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-mono font-medium",
        conv.avatarClass,
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs",
      )}
    >
      {conv.initials}
    </div>
  );
}

// ─── Calendar date box ────────────────────────────────────────────────────────

function EventDateBox({ event }: { event: CalendarEvent }) {
  return (
    <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-[8px] border border-border bg-surface">
      <span className="font-mono text-[6px] leading-none font-bold tracking-widest text-muted uppercase">
        {event.dayName}
      </span>
      <span className="font-mono text-[12px] leading-none font-bold text-dim">{event.dayNum}</span>
    </div>
  );
}

// ─── Heights ──────────────────────────────────────────────────────────────────

const CHAT_H = 340;

// ─── Main component ───────────────────────────────────────────────────────────

export function ExpandableNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [messagesByConv, setMessagesByConv] = useState<Record<number, Message[]>>(
    Object.fromEntries(conversations.map((c) => [c.id, c.messages])),
  );
  const [input, setInput] = useState("");
  const [listRef, { height: listHeight }] = useMeasure();
  const [eventRef, { height: eventHeight }] = useMeasure();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { factor } = useSpeedControl();
  const reduced = useReducedMotion() ?? false;

  const spring = reduced
    ? { type: "tween" as const, duration: 0 }
    : scaleTransition({ type: "spring" as const, duration: 0.3, bounce: 0 }, factor);
  const fast = reduced ? { duration: 0 } : scaleTransition({ duration: 0.18 }, factor);
  const medium = reduced
    ? { duration: 0 }
    : scaleTransition({ duration: 0.2, ease: [0.2, 0, 0, 1] as const }, factor);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const unreadCount = conversations.filter((c) => c.unread).length;
  const isDetailOpen = activeId !== null || activeEvent !== null;
  const newCount = notifications.filter(
    (n) => n.type === "calendar" || (n.type === "conversation" && n.unread),
  ).length;

  function scrollToBottom(smooth = false) {
    const el = chatScrollRef.current;
    if (!el) return;
    if (smooth && !reduced) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }

  // Scroll to bottom when opening a chat
  useEffect(() => {
    if (activeId !== null) scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Scroll to bottom when a new message is sent
  useEffect(() => {
    if (activeId !== null) scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesByConv]);

  function openChat(id: number) {
    setActiveEvent(null);
    setActiveId(id);
    setIsOpen(true);
  }

  function closeChat() {
    setActiveId(null);
  }

  function openEvent(event: CalendarEvent) {
    setActiveId(null);
    setActiveEvent(event);
    setIsOpen(true);
  }

  function closeEvent() {
    setActiveEvent(null);
  }

  function sendMessage() {
    if (!input.trim() || activeId === null) return;
    const msg: Message = { id: Date.now(), from: "me", text: input.trim(), time: "Just now" };
    setMessagesByConv((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setInput("");
  }

  // Header height: compact when list is open but no detail; full otherwise
  const headerH = isOpen && !isDetailOpen ? 36 : 68;

  return (
    <>
      <MotionConfig transition={spring}>
        <motion.div className="w-full max-w-sm overflow-hidden rounded-[20px] border border-border bg-paper">
          {/* ── Header ── */}
          <motion.div
            className={cn(
              "group relative flex shrink-0 items-center overflow-hidden",
              !isDetailOpen && "cursor-pointer",
            )}
            animate={{ height: headerH }}
            transition={spring}
            role={!isDetailOpen ? "button" : undefined}
            tabIndex={!isDetailOpen ? 0 : undefined}
            onClick={!isDetailOpen ? () => setIsOpen((o) => !o) : undefined}
            onKeyDown={
              !isDetailOpen
                ? (e) => (e.key === "Enter" || e.key === " ") && setIsOpen((o) => !o)
                : undefined
            }
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {activeConv ? (
                // Chat header
                <motion.div
                  key="chat-header"
                  className="flex w-full items-center gap-3 px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fast}
                >
                  <button
                    type="button"
                    onClick={closeChat}
                    aria-label="Back to notifications"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <ConvAvatar conv={activeConv} size="sm" />
                  <span className="text-sm font-medium text-ink">{activeConv.name}</span>
                </motion.div>
              ) : activeEvent ? (
                // Event header
                <motion.div
                  key="event-header"
                  className="flex w-full items-center gap-2 px-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={medium}
                >
                  <button
                    type="button"
                    onClick={closeEvent}
                    aria-label="Back to notifications"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-muted">
                    {activeEvent.dayName} {activeEvent.dayNum}
                  </span>
                  <span className="text-muted/30">·</span>
                  <span className="text-xs text-muted">{activeEvent.timeRange}</span>
                  <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                    {activeEvent.timeUntil}
                  </span>
                </motion.div>
              ) : (
                // Notifications header — shared key keeps it mounted across collapsed/expanded
                <motion.div
                  key="notifications-header"
                  className="flex w-full items-center justify-between px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover="hovered"
                  transition={fast}
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="text-sm font-semibold"
                        variants={{ hovered: { color: isOpen ? "var(--dim)" : "var(--ink)" } }}
                        animate={{ color: isOpen ? "var(--muted)" : "var(--ink)" }}
                        transition={fast}
                      >
                        Notifications
                      </motion.span>
                      <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                        {newCount}
                      </span>
                    </div>
                    <AnimatePresence initial={false}>
                      {!isOpen && (
                        <motion.p
                          key="subtitle"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={fast}
                          className="mt-0.5 truncate text-xs text-muted"
                        >
                          {unreadCount} messages · 1 invite
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={spring}
                    className="shrink-0"
                  >
                    <CaretUpIcon className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-ink" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Content area ── */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="content"
                className="relative overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height:
                    activeId !== null ? CHAT_H : activeEvent !== null ? eventHeight : listHeight,
                  opacity: 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={spring}
              >
                {/* List panel */}
                <motion.div
                  className="absolute inset-0"
                  style={{ pointerEvents: isDetailOpen ? "none" : "auto" }}
                  animate={{
                    x: activeId !== null ? -40 : 0,
                    y: activeEvent !== null ? -8 : 0,
                    opacity: isDetailOpen ? 0 : 1,
                  }}
                >
                  <div ref={listRef} className="space-y-0.5 px-2 pb-2">
                    {notifications.map((item, index) => {
                      if (item.type === "conversation") {
                        return (
                          <motion.div
                            key={item.id}
                            className="flex cursor-pointer items-center gap-3 rounded-[12px] p-3 hover:bg-surface"
                            onClick={() => openChat(item.id)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={scaleTransition(
                              {
                                delay: reduced ? 0 : index * 0.04,
                                duration: reduced ? 0 : 0.2,
                              },
                              factor,
                            )}
                          >
                            <div className="relative">
                              <ConvAvatar conv={item} />
                              {item.unread && (
                                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-paper" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-sm font-medium text-ink">{item.name}</span>
                                <span className="shrink-0 font-mono text-2xs text-muted">
                                  {item.time}
                                </span>
                              </div>
                              <p className="truncate text-xs text-muted">{item.preview}</p>
                            </div>
                          </motion.div>
                        );
                      } else {
                        // Calendar event card
                        return (
                          <motion.div
                            key={item.id}
                            className="cursor-pointer rounded-[12px] border border-border bg-surface p-3 hover:bg-accent/10"
                            onClick={() => openEvent(item)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={scaleTransition(
                              {
                                delay: reduced ? 0 : index * 0.04,
                                duration: reduced ? 0 : 0.2,
                              },
                              factor,
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <EventDateBox event={item} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-ink">
                                    {item.title}
                                  </span>
                                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                                    invited
                                  </span>
                                </div>
                                <p className="mt-0.5 text-2xs text-muted">{item.timeRange}</p>
                              </div>
                            </div>
                            <div className="mt-2.5 flex items-center gap-2">
                              <div className="flex -space-x-1.5">
                                {item.attendees.slice(0, 3).map((a) => (
                                  <div
                                    key={a.initials}
                                    className={cn(
                                      "flex h-[18px] w-[18px] items-center justify-center rounded-full font-mono text-[7px] font-medium ring-1 ring-surface",
                                      a.className,
                                    )}
                                  >
                                    {a.initials}
                                  </div>
                                ))}
                              </div>
                              <span className="text-2xs text-muted">
                                {item.organizer} and {item.attendees.length - 1} others
                              </span>
                            </div>
                          </motion.div>
                        );
                      }
                    })}
                  </div>
                </motion.div>

                {/* Chat panel */}
                <motion.div
                  className="absolute inset-0 flex flex-col"
                  style={{ pointerEvents: activeId !== null ? "auto" : "none" }}
                  animate={{
                    opacity: activeId !== null ? 1 : 0,
                  }}
                >
                  <motion.div
                    animate={{ x: activeId !== null ? 0 : 40 }}
                    className="min-h-0 flex-1"
                  >
                    <div
                      ref={chatScrollRef}
                      className="h-full overflow-y-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {activeId !== null &&
                        (messagesByConv[activeId] ?? []).map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "mb-1.5 flex",
                              msg.from === "me" ? "justify-end" : "justify-start",
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[75%] rounded-[14px] px-3 py-2 text-xs leading-relaxed text-ink",
                                msg.from === "me"
                                  ? "rounded-br-[4px] bg-mid"
                                  : "rounded-bl-[4px] bg-surface",
                              )}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                  <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-2.5">
                    <input
                      aria-label="Message"
                      className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-muted"
                      placeholder="Message…"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      aria-label="Send message"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent/20 text-accent transition-opacity focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none disabled:opacity-30"
                    >
                      <PaperPlaneTiltIcon className="h-3.5 w-3.5" weight="fill" />
                    </button>
                  </div>
                </motion.div>

                {/* Event detail panel */}
                <motion.div
                  className="absolute inset-0"
                  style={{ pointerEvents: activeEvent !== null ? "auto" : "none" }}
                  animate={{ opacity: activeEvent !== null ? 1 : 0 }}
                  transition={fast}
                >
                  <div ref={eventRef}>
                    {activeEvent && (
                      <div>
                        {/* Title + location */}
                        <div className="px-4 pt-2 pb-4">
                          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-ink">
                            {activeEvent.title}
                          </h2>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <VideoCameraIcon
                              className="h-3 w-3 shrink-0 text-muted"
                              weight="light"
                            />
                            <span className="text-xs text-muted">
                              {activeEvent.location} · Video call
                            </span>
                          </div>
                        </div>

                        {/* Invited by row */}
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {activeEvent.attendees.map((a) => (
                                <div
                                  key={a.initials}
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[8px] font-medium ring-[1.5px] ring-paper",
                                    a.className,
                                  )}
                                >
                                  {a.initials}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-muted">
                              {activeEvent.organizer} and {activeEvent.attendees.length - 1} others
                            </span>
                          </div>
                          <span className="text-xs text-muted">{activeEvent.duration}</span>
                        </div>

                        {/* Accept / Decline */}
                        <div className="flex items-center gap-2 px-3 py-3">
                          <button
                            type="button"
                            className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] border border-border py-2 text-xs font-medium text-muted transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-accent/15 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/25 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    </>
  );
}
