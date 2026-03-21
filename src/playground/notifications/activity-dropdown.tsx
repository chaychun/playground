"use client";

import { cn } from "@/lib/cn";
import { useMeasure } from "@/lib/use-measure";
import { ArrowLeftIcon, BellIcon, CaretUpIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  initials: string;
  avatarClass: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialConversations: Conversation[] = [
  {
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
    id: 3,
    name: "Lena Park",
    initials: "LP",
    avatarClass: "bg-[#1a3024] text-[#70b894]",
    preview: "also have you started that book yet?",
    time: "3 hours ago",
    unread: false,
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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ conv, size = "md" }: { conv: Conversation; size?: "sm" | "md" }) {
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

// ─── Heights ──────────────────────────────────────────────────────────────────

const CHAT_H = 340; // 288px messages + 52px input

// ─── Main component ───────────────────────────────────────────────────────────

export function ActivityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messagesByConv, setMessagesByConv] = useState<Record<number, Message[]>>(
    Object.fromEntries(initialConversations.map((c) => [c.id, c.messages])),
  );
  const [input, setInput] = useState("");
  const [listRef, { height: listHeight }] = useMeasure();

  const activeConv = initialConversations.find((c) => c.id === activeId) ?? null;
  const unreadCount = initialConversations.filter((c) => c.unread).length;

  function openChat(id: number) {
    setActiveId(id);
    if (!isOpen) setIsOpen(true);
  }

  function closeChat() {
    setActiveId(null);
  }

  function sendMessage() {
    if (!input.trim() || activeId === null) return;
    const msg: Message = { id: Date.now(), from: "me", text: input.trim(), time: "Just now" };
    setMessagesByConv((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setInput("");
  }

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.45, bounce: 0 }}>
      <motion.div className="w-full max-w-sm overflow-hidden rounded-[20px] border border-border bg-paper">
        {/* ── Header ── */}
        <div className="relative flex h-[68px] shrink-0 items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeConv ? (
              // Chat header
              <motion.div
                key="chat-header"
                className="flex w-full items-center gap-3 px-3"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  type="button"
                  onClick={closeChat}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <Avatar conv={activeConv} size="sm" />
                <span className="text-sm font-medium text-ink">{activeConv.name}</span>
              </motion.div>
            ) : (
              // List header
              <motion.div
                key="list-header"
                className="flex w-full cursor-pointer items-center gap-3 px-4"
                onClick={() => setIsOpen((v) => !v)}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface">
                  <BellIcon className="h-[18px] w-[18px] text-dim" weight="light" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-sm font-medium text-ink">
                    {unreadCount > 0 ? `${unreadCount} unread` : "Messages"}
                  </h3>
                  <p
                    className={cn(
                      "truncate text-xs text-muted",
                      "transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isOpen ? "max-h-0 opacity-0" : "mt-0.5 max-h-5 opacity-100",
                    )}
                  >
                    {initialConversations[0].name}: {initialConversations[0].preview}
                  </p>
                </div>
                <CaretUpIcon
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isOpen ? "rotate-0" : "rotate-180",
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content area ── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              className="relative overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: activeId !== null ? CHAT_H : listHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0 }}
            >
              {/* List panel */}
              <motion.div
                className="absolute inset-0"
                style={{ pointerEvents: activeId !== null ? "none" : "auto" }}
                animate={{
                  x: activeId !== null ? -40 : 0,
                  opacity: activeId !== null ? 0 : 1,
                  filter: activeId !== null ? "blur(4px)" : "blur(0px)",
                }}
              >
                <div ref={listRef} className="space-y-0.5 p-2">
                  {initialConversations.map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      className="flex cursor-pointer items-center gap-3 rounded-[12px] p-3 hover:bg-surface"
                      onClick={() => openChat(conv.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                    >
                      <Avatar conv={conv} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-ink">{conv.name}</span>
                          <span className="shrink-0 font-mono text-2xs text-muted">
                            {conv.time}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted">{conv.preview}</p>
                      </div>
                      {conv.unread && (
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Chat panel */}
              <motion.div
                className="absolute inset-0 flex flex-col"
                style={{ pointerEvents: activeId !== null ? "auto" : "none" }}
                animate={{
                  x: activeId !== null ? 0 : 40,
                  opacity: activeId !== null ? 1 : 0,
                  filter: activeId !== null ? "blur(0px)" : "blur(4px)",
                }}
              >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

                {/* Input */}
                <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-2.5">
                  <input
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
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent/20 text-accent transition-opacity disabled:opacity-30"
                  >
                    <PaperPlaneTiltIcon className="h-3.5 w-3.5" weight="fill" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
