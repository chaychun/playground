"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Modifiers = {
  meta: boolean;
  shift: boolean;
  alt: boolean;
  ctrl: boolean;
};

const INITIAL_MODIFIERS: Modifiers = {
  meta: false,
  shift: false,
  alt: false,
  ctrl: false,
};

const ACTION_MAP: Record<string, string> = {
  "": "Send message",
  shift: "New line",
  meta: "Send and close",
  "shift+meta": "Send to all",
};

function getModifierKey(mods: Modifiers): string {
  const parts: string[] = [];
  if (mods.ctrl) parts.push("ctrl");
  if (mods.alt) parts.push("alt");
  if (mods.shift) parts.push("shift");
  if (mods.meta) parts.push("meta");
  return parts.join("+");
}

/** Mac-order modifier symbols: ⌃ → ⌥ → ⇧ → ⌘ */
const MODIFIER_DISPLAY: { key: keyof Modifiers; symbol: string }[] = [
  { key: "ctrl", symbol: "⌃" },
  { key: "alt", symbol: "⌥" },
  { key: "shift", symbol: "⇧" },
  { key: "meta", symbol: "⌘" },
];

function Keycap({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "enter" | "enter-error" | "error";
}) {
  const isEnterSize = variant === "enter" || variant === "enter-error";
  const isError = variant === "error" || variant === "enter-error";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-mono text-base font-medium",
        "select-none",
        isEnterSize ? "min-w-[88px] px-5 py-2.5" : "min-w-[52px] px-4 py-2.5",
        isError
          ? [
              "bg-[#3a2828]",
              "border border-[#5a3535]",
              "text-[#c47070]",
              "shadow-[0_4px_0_0_#2a1515,0_4px_8px_rgba(80,30,30,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]",
            ]
          : [
              "bg-[#3a3936]",
              "border border-[#4a4947]",
              "text-ink",
              "shadow-[0_4px_0_0_rgba(26,25,24,1),0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]",
            ],
      )}
    >
      {children}
    </div>
  );
}

const spring = { type: "spring" as const, visualDuration: 0.15, bounce: 0.15 };

export default function ModifierKeys() {
  const [modifiers, setModifiers] = useState<Modifiers>(INITIAL_MODIFIERS);

  useEffect(() => {
    function syncModifiers(e: KeyboardEvent) {
      setModifiers({
        meta: e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
      });
    }

    function reset() {
      setModifiers(INITIAL_MODIFIERS);
    }

    document.addEventListener("keydown", syncModifiers);
    document.addEventListener("keyup", syncModifiers);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);

    return () => {
      document.removeEventListener("keydown", syncModifiers);
      document.removeEventListener("keyup", syncModifiers);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  const comboKey = getModifierKey(modifiers);
  const action = ACTION_MAP[comboKey];
  const isError = comboKey !== "" && action === undefined;
  const activeModifiers = MODIFIER_DISPLAY.filter((m) => modifiers[m.key]);
  const hasModifiers = activeModifiers.length > 0;

  return (
    <div className="flex h-full items-center justify-center rounded-2xl bg-[#1a1918]">
      <div className="flex h-[46px] items-center gap-4">
        {/* Modifier keys area — fixed width so Enter never moves */}
        <div className="flex w-[180px] items-center justify-end gap-3">
          <AnimatePresence mode="popLayout">
            {hasModifiers ? (
              activeModifiers.map((m) => (
                <motion.div
                  key={m.key}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={spring}
                >
                  <Keycap variant={isError ? "error" : "default"}>{m.symbol}</Keycap>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-[44px] w-[52px] rounded-lg border-2 border-dashed border-mid"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Enter key — always in place */}
        <Keycap variant={isError ? "enter-error" : "enter"}>
          <span className="font-mono text-sm tracking-wide">Enter ↵</span>
        </Keycap>

        {/* Action text — fixed position */}
        <div
          className={cn(
            "w-[160px] font-sans text-base font-semibold",
            isError ? "text-muted italic" : "text-ink",
          )}
        >
          {action ?? "Not available"}
        </div>
      </div>
    </div>
  );
}
