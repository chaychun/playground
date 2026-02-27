"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { isActiveLink, NAV_LINKS } from "@/data/nav";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-12 animate-slide-in-down items-center justify-between border-b border-border bg-paper/90 px-5 backdrop-blur-md lg:hidden">
      <Link href="/" className="text-sm font-semibold tracking-tight text-ink">
        Chayut C.
      </Link>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-3">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = isActiveLink(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-xs transition-colors",
                  isActive ? "font-medium text-ink" : "text-muted hover:text-link",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="h-3 w-px bg-border" />
        <ThemeToggle className="size-5" />
      </div>
    </header>
  );
}
