"use client";

import { cn } from "@/lib/cn";
import { entrance } from "@/lib/entrance";
import { usePathname, useRouter } from "next/navigation";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const router = useRouter();
  const page = pathname.split("/").find(Boolean);

  return (
    <nav
      className="flex items-center gap-1.5 font-mono text-[13px] tracking-[0.02em] select-none"
      aria-label="Breadcrumb"
    >
      {page ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer text-ink transition-colors hover:text-accent"
        >
          chayut.me
        </button>
      ) : (
        <span className="text-ink transition-colors hover:text-accent">chayut.me</span>
      )}
      {page && (
        <>
          <span
            key={`sep-${page}`}
            className={cn("text-muted", entrance({ duration: 500, slide: false }))}
          >
            /
          </span>
          <span
            key={page}
            className={cn("text-dim", entrance({ delay: 50, duration: 500, slide: "left-1" }))}
          >
            {page}
          </span>
        </>
      )}
    </nav>
  );
}
