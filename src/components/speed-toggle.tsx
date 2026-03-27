"use client";

import { useSpeedControl } from "@/lib/speed-context";

export function SpeedToggle() {
  const { factor, toggle } = useSpeedControl();

  return (
    <button
      type="button"
      onClick={toggle}
      className="cursor-pointer font-mono text-body-sm tracking-[0.02em] text-white/70 transition-opacity hover:opacity-70"
    >
      {factor}x
    </button>
  );
}
