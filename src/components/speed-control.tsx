"use client";

import { cn } from "@/lib/cn";
import { SpeedContext } from "@/lib/speed-context";
import { useCallback, useMemo, useState, type ReactNode } from "react";

interface SpeedControlProps {
  children: ReactNode;
  slowFactor?: number;
}

export function SpeedControl({ children, slowFactor = 0.5 }: SpeedControlProps) {
  const [factor, setFactor] = useState(1);
  const toggle = useCallback(() => setFactor((f) => (f === 1 ? slowFactor : 1)), [slowFactor]);
  const ctx = useMemo(() => ({ factor, toggle }), [factor, toggle]);

  return (
    <SpeedContext.Provider value={ctx}>
      <div className="absolute inset-0">
        {children}
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "absolute top-2 right-2 z-50 cursor-pointer rounded-full px-2 py-0.5 font-mono text-[11px] ring-1 transition-colors ring-inset",
            factor === 1 ? "text-muted ring-border" : "bg-accent/10 text-accent ring-accent",
          )}
        >
          {factor === 1 ? "1x" : `${slowFactor}x`}
        </button>
      </div>
    </SpeedContext.Provider>
  );
}
