"use client";

import { SpeedContext } from "@/lib/speed-context";
import { useCallback, useMemo, useState, type ReactNode } from "react";

interface SpeedProviderProps {
  children: ReactNode;
  slowFactor?: number;
}

export function SpeedProvider({ children, slowFactor = 0.5 }: SpeedProviderProps) {
  const [factor, setFactor] = useState(1);
  const toggle = useCallback(() => setFactor((f) => (f === 1 ? slowFactor : 1)), [slowFactor]);
  const ctx = useMemo(() => ({ factor, toggle }), [factor, toggle]);

  return <SpeedContext.Provider value={ctx}>{children}</SpeedContext.Provider>;
}
