"use client";

import { SpeedContext } from "@/lib/speed-context";
import { useCallback, useMemo, useState, type ReactNode } from "react";

const PRESETS = [1, 0.5, 0.25] as const;

export function SpeedProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const toggle = useCallback(() => setIndex((i) => (i + 1) % PRESETS.length), []);
  const factor = PRESETS[index];
  const ctx = useMemo(() => ({ factor, toggle }), [factor, toggle]);

  return <SpeedContext.Provider value={ctx}>{children}</SpeedContext.Provider>;
}
