import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

function parseAspectRatio(value: string): string | undefined {
  const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) return undefined;
  const [, w, h] = match;
  if (Number(h) === 0) return undefined;
  return `${w}/${h}`;
}

export function ComponentFrame({
  size = 1,
  aspectRatio,
  minHeight,
  children,
}: {
  size?: number;
  aspectRatio?: string;
  minHeight?: number;
  children: ReactNode;
}) {
  const parsedRatio = aspectRatio ? parseAspectRatio(aspectRatio) : undefined;

  // size <= 1: percentage width, centered
  // size > 1: break out of column via negative margins
  const isBreakout = size > 1;
  const widthPercent = `${size * 100}%`;
  const marginInline = isBreakout ? `${((size - 1) / 2) * -100}%` : undefined;

  return (
    <div
      className={cn("relative my-6 overflow-hidden", !isBreakout && size < 1 && "mx-auto")}
      style={{
        width: widthPercent,
        ...(isBreakout && { marginInline }),
        ...(parsedRatio && { aspectRatio: parsedRatio }),
        ...(minHeight && { minHeight: `${minHeight}px` }),
      }}
    >
      {children}
    </div>
  );
}
