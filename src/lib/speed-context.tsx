"use client";

import { createContext, useContext } from "react";

interface SpeedContextValue {
  factor: number;
  toggle: () => void;
}

export const SpeedContext = createContext<SpeedContextValue>({ factor: 1, toggle: () => {} });

export function useSpeedControl() {
  return useContext(SpeedContext);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTransition = Record<string, any>;

function isPlainObject(v: unknown): v is AnyTransition {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const SCALE_KEYS = new Set(["duration", "delay", "visualDuration", "repeatDelay"]);

function scaleTransitionObject(t: AnyTransition, factor: number): AnyTransition {
  const scaled: AnyTransition = {};

  for (const [key, value] of Object.entries(t)) {
    if (isPlainObject(value)) {
      // Per-property config or nested transition → recurse
      scaled[key] = scaleTransitionObject(value, factor);
    } else if (SCALE_KEYS.has(key) && typeof value === "number") {
      scaled[key] = value / factor;
    } else {
      scaled[key] = value;
    }
  }

  // Scale spring physics: preserve spring character while slowing by factor.
  // New mass = old_mass / f^2, new damping = old_damping / f
  if (typeof t.stiffness === "number" || typeof t.damping === "number") {
    const currentMass = typeof t.mass === "number" ? t.mass : 1;
    scaled.mass = currentMass / (factor * factor);
    if (typeof t.damping === "number") {
      scaled.damping = t.damping / factor;
    }
  }

  return scaled;
}

export function scaleTransition(transition: AnyTransition, factor: number): AnyTransition {
  if (factor === 1) return transition;
  return scaleTransitionObject(transition, factor);
}

export function scaleTime(value: number, factor: number): number {
  return value / factor;
}
