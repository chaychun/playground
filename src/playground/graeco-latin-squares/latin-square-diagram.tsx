"use client";

import {
  CircleIcon,
  ClubIcon,
  DiamondIcon,
  HeartIcon,
  HexagonIcon,
  SpadeIcon,
  SquareIcon,
  TriangleIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/**
 * A visually interesting valid 4×4 Latin square.
 * Each symbol appears exactly once per row and column.
 * Pre-flattened with stable keys derived from cell coordinates.
 */
const CELLS = [
  [0, 1, 2, 3],
  [2, 3, 0, 1],
  [3, 2, 1, 0],
  [1, 0, 3, 2],
].flatMap((row, r) => row.map((val, c) => ({ key: `r${r}c${c}`, val })));

const ALPHABETS = ["A", "B", "C", "D"];
const NUMBERS = ["1", "2", "3", "4"];
const SHAPES: Icon[] = [CircleIcon, SquareIcon, TriangleIcon, HexagonIcon];
const SUITS: Icon[] = [SpadeIcon, HeartIcon, DiamondIcon, ClubIcon];

function Grid({ label, renderCell }: { label: string; renderCell: (value: number) => ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="grid w-full grid-cols-4 gap-px border border-border bg-border">
        {CELLS.map((cell) => (
          <div
            key={cell.key}
            className="flex aspect-square items-center justify-center bg-paper text-dim"
          >
            {renderCell(cell.val)}
          </div>
        ))}
      </div>
      <span className="font-mono text-meta tracking-[0.04em] text-muted uppercase">{label}</span>
    </div>
  );
}

export function LatinSquareDiagram() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-6">
      <Grid
        label="Alphabets"
        renderCell={(v) => <span className="font-mono text-xs sm:text-sm">{ALPHABETS[v]}</span>}
      />
      <Grid
        label="Numbers"
        renderCell={(v) => <span className="font-mono text-xs sm:text-sm">{NUMBERS[v]}</span>}
      />
      <Grid
        label="Shapes"
        renderCell={(v) => {
          const ShapeIcon = SHAPES[v];
          return <ShapeIcon weight="regular" className="size-3 sm:size-4" />;
        }}
      />
    </div>
  );
}

const GRAECO_LATIN_CELLS = [
  // A♠, K♥, Q♦, J♣ mapped to suits
  [
    { char: "A", suit: 0, color: "text-dim" }, // ♠ 0
    { char: "K", suit: 1, color: "text-red-500" }, // ♥ 1
    { char: "Q", suit: 2, color: "text-red-500" }, // ♦ 2
    { char: "J", suit: 3, color: "text-dim" }, // ♣ 3
  ],
  // J♦, Q♣, K♠, A♥
  [
    { char: "J", suit: 2, color: "text-red-500" },
    { char: "Q", suit: 3, color: "text-dim" },
    { char: "K", suit: 0, color: "text-dim" },
    { char: "A", suit: 1, color: "text-red-500" },
  ],
  // K♣, A♦, J♥, Q♠
  [
    { char: "K", suit: 3, color: "text-dim" },
    { char: "A", suit: 2, color: "text-red-500" },
    { char: "J", suit: 1, color: "text-red-500" },
    { char: "Q", suit: 0, color: "text-dim" },
  ],
  // Q♥, J♠, A♣, K♦
  [
    { char: "Q", suit: 1, color: "text-red-500" },
    { char: "J", suit: 0, color: "text-dim" },
    { char: "A", suit: 3, color: "text-dim" },
    { char: "K", suit: 2, color: "text-red-500" },
  ],
].flatMap((row, r) => row.map((val, c) => ({ key: `gl-r${r}c${c}`, ...val })));

export function GraecoLatinPatternDiagram() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2.5">
      <div className="grid w-full max-w-[240px] grid-cols-4 gap-px border border-border bg-border">
        {GRAECO_LATIN_CELLS.map((cell) => {
          const SuitIcon = SUITS[cell.suit];
          return (
            <div
              key={cell.key}
              className="flex aspect-square items-center justify-center gap-1 bg-paper sm:gap-1.5"
            >
              <span className={`font-mono text-sm font-medium sm:text-base ${cell.color}`}>
                {cell.char}
              </span>
              <SuitIcon weight="fill" className={`size-3 sm:size-4 ${cell.color}`} />
            </div>
          );
        })}
      </div>
      <span className="font-mono text-meta tracking-[0.04em] text-muted uppercase">
        Graeco-Latin Pattern
      </span>
    </div>
  );
}
