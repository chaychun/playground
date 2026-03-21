import { cn } from "@/lib/cn";
import { Suspense } from "react";
import type { ReactNode } from "react";

function parseAspectRatio(value: string): string | undefined {
  const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!match) return undefined;
  const [, w, h] = match;
  if (Number(h) === 0) return undefined;
  return `${w}/${h}`;
}

function FrameSkeleton() {
  return <div className="absolute inset-0" />;
}

export function Frame({
  size = 1,
  aspectRatio,
  minHeight,
  className,
  children,
}: {
  size?: number;
  aspectRatio?: string;
  minHeight?: number;
  className?: string;
  children: ReactNode;
}) {
  const parsedRatio = aspectRatio ? parseAspectRatio(aspectRatio) : undefined;
  const isBreakout = size > 1;
  const widthPercent = `${size * 100}%`;
  const marginInline = isBreakout ? `${((size - 1) / 2) * -100}%` : undefined;

  return (
    <div
      className={cn("relative my-6 overflow-hidden", !isBreakout && "mx-auto", className)}
      style={{
        width: widthPercent,
        ...(isBreakout && { marginInline }),
        ...(parsedRatio && { aspectRatio: parsedRatio }),
        ...(minHeight && { minHeight: `${minHeight}px` }),
      }}
    >
      <Suspense fallback={<FrameSkeleton />}>{children}</Suspense>
    </div>
  );
}
