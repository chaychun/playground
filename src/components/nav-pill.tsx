"use client";

import { cn } from "@/lib/cn";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export function NavPill({ title, theme = "light" }: { title: string; theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <nav className="fixed top-0 left-0 z-50 p-3 sm:p-4" aria-label="Breadcrumb">
      <Link
        href="/"
        className={cn(
          "group flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md transition-opacity hover:opacity-80",
          "sm:gap-2 sm:px-3.5 sm:py-2",
          isDark
            ? "bg-black/50 ring-1 ring-white/[0.08]"
            : "bg-white/70 shadow-sm ring-1 ring-black/[0.06]",
        )}
      >
        <ArrowLeft
          weight="bold"
          className={cn(
            "size-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5",
            isDark ? "text-white/75" : "text-ink/70",
          )}
          aria-hidden="true"
        />

        <span
          className={cn(
            "text-xs leading-none font-medium",
            isDark ? "text-white/75" : "text-ink/70",
          )}
        >
          playground
        </span>

        {/* Separator + component name — hidden on mobile */}
        <span className="hidden items-center gap-2 sm:flex">
          <span
            className={cn(
              "inline-block h-0.5 w-0.5 rounded-full",
              isDark ? "bg-white/30" : "bg-ink/25",
            )}
            aria-hidden="true"
          />
          <span
            className={cn("text-[11px] leading-none", isDark ? "text-white/40" : "text-ink/35")}
          >
            {title}
          </span>
        </span>
      </Link>
    </nav>
  );
}
