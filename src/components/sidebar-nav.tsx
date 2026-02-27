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
              "text-sm transition-colors",
              isActive ? "font-medium text-ink" : "text-muted hover:text-link",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
