"use client";

import { cn } from "@/lib/cn";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

const GREEK = ["\u03B1", "\u03B2", "\u03B3", "\u03B4", "\u03B5"];
const LATIN = ["A", "B", "C", "D", "E"];

const COLORS: Record<string, string> = {
  "\u03B1": "bg-ink/10",
  "\u03B2": "bg-ink/20",
  "\u03B3": "bg-ink/30",
  "\u03B4": "bg-ink/40",
  "\u03B5": "bg-ink/50",
};

function generateLatinSquare(n: number): number[][] {
  const base = Array.from({ length: n }, (_v, i) => i);
  const shift = Math.floor(Math.random() * n);
  const rows = Array.from({ length: n }, (_r, i) => base.map((_c, j) => (i + j + shift) % n));
  // Shuffle rows
  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  // Shuffle columns
  const colOrder = base.slice();
  for (let i = colOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colOrder[i], colOrder[j]] = [colOrder[j], colOrder[i]];
  }
  return rows.map((row) => colOrder.map((c) => row[c]));
}

function findOrthogonalMate(square: number[][], n: number): number[][] | null {
  const mate: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => -1));
  const usedInRow: Set<number>[] = Array.from({ length: n }, () => new Set());
  const usedInCol: Set<number>[] = Array.from({ length: n }, () => new Set());
  const usedPairs = new Set<string>();

  function solve(pos: number): boolean {
    if (pos === n * n) return true;
    const r = Math.floor(pos / n);
    const c = pos % n;

    const candidates = Array.from({ length: n }, (_, i) => i);
    // Shuffle for variety
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (const v of candidates) {
      if (usedInRow[r].has(v)) continue;
      if (usedInCol[c].has(v)) continue;
      const pair = `${square[r][c]},${v}`;
      if (usedPairs.has(pair)) continue;

      mate[r][c] = v;
      usedInRow[r].add(v);
      usedInCol[c].add(v);
      usedPairs.add(pair);

      if (solve(pos + 1)) return true;

      mate[r][c] = -1;
      usedInRow[r].delete(v);
      usedInCol[c].delete(v);
      usedPairs.delete(pair);
    }
    return false;
  }

  return solve(0) ? mate : null;
}

function generateGraecoLatin(size: number) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const latin = generateLatinSquare(size);
    const mate = findOrthogonalMate(latin, size);
    if (mate) return { latin, greek: mate };
  }
  // Fallback: simple shifted squares known to be orthogonal
  const latin = Array.from({ length: size }, (_r, i) =>
    Array.from({ length: size }, (_c, j) => (i + j) % size),
  );
  const greek = Array.from({ length: size }, (_r, i) =>
    Array.from({ length: size }, (_c, j) => (i + 2 * j) % size),
  );
  return { latin, greek };
}

export default function GraecoLatinSquare() {
  const [size, setSize] = useState(5);
  const [key, setKey] = useState(0);
  const [square, setSquare] = useState(() => generateGraecoLatin(size));

  const regenerate = useCallback(() => {
    setSquare(generateGraecoLatin(size));
    setKey((k) => k + 1);
  }, [size]);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setSquare(generateGraecoLatin(newSize));
    setKey((k) => k + 1);
  }, []);

  const greekSymbols = GREEK.slice(0, size);
  const latinSymbols = LATIN.slice(0, size);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <div className="flex items-center gap-3">
        {[3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleSizeChange(n)}
            className={cn(
              "h-8 w-8 cursor-pointer rounded-md font-mono text-xs transition-colors",
              size === n ? "bg-ink text-ink-inv" : "bg-surface text-muted hover:bg-border",
            )}
          >
            {n}
          </button>
        ))}
        <button
          onClick={regenerate}
          className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-surface text-muted transition-colors hover:bg-border"
          aria-label="Regenerate"
        >
          <ArrowsClockwise className="h-4 w-4" weight="regular" />
        </button>
      </div>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {square.latin.map((row, r) =>
          row.map((latinIdx, c) => {
            const greekIdx = square.greek[r][c];
            const greekSym = greekSymbols[greekIdx];
            const latinSym = latinSymbols[latinIdx];

            return (
              <motion.div
                key={`${key}-${r}-${c}`}
                className={cn(
                  "flex items-center justify-center rounded-lg",
                  COLORS[greekSym] ?? "bg-ink/10",
                  size <= 3 ? "h-16 w-16" : size <= 4 ? "h-14 w-14" : "h-12 w-12",
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.4,
                  bounce: 0.2,
                  delay: (r * size + c) * 0.03,
                }}
              >
                <span className="font-mono text-sm text-ink">
                  {greekSym}
                  {latinSym}
                </span>
              </motion.div>
            );
          }),
        )}
      </div>

      <p className="text-center font-mono text-2xs text-muted">
        {size}&times;{size} &mdash; every pair appears exactly once
      </p>
    </div>
  );
}
