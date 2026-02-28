"use client";

import { isActiveLink, NAV_LINKS } from "@/data/nav";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = isActiveLink(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 py-0.5 text-sm transition-colors duration-300",
              isActive ? "font-medium text-ink" : "text-muted hover:text-link",
            )}
          >
            <span
              className={cn(
                "size-1 shrink-0 rounded-full bg-ink transition-[opacity,transform] duration-300",
                isActive ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
