"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
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
