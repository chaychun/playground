"use client";

import { cn } from "@/lib/cn";
import { useLayoutEffect, useRef, type ComponentProps } from "react";

const DELAY_MS = 50;
const MAX_TOTAL_MS = 500;

export function StaggerEntrance({ className, children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const n = el.children.length;
    const step = Math.min(DELAY_MS, MAX_TOTAL_MS / n);
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.animationDelay = `${(i + 1) * step}ms`;
    });
  }, []);

  return (
    <div ref={ref} className={cn("stagger-entrance", className)} {...props}>
      {children}
    </div>
  );
}
