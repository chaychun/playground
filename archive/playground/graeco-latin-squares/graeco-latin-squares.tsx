"use client";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 *    0ms   mount — controls slide up, grid appears
 *          tiles scale 0.85→1 + fade from upper-left (i+j diagonal, 20ms/step)
 *
 * On size change: grid remounts, tiles re-stagger from upper-left
 * On randomize: rapid shuffle (4 intermediate states, 60ms apart) then settle
 * On n=6: selector turns destructive, impossible msg fades in
 * ───────────────────────────────────────────────────────── */

import { cn } from "@/lib/cn";
import { ArrowsClockwiseIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { generateRandom } from "./core";
import { selectRandomColors } from "./palette";

const SIZES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const IMPOSSIBLE = new Set([6]);
const CELL = 60;
const INNER = 24;
const DEFAULT_SIZE = 5;

// ── Animation config ──────────────────────────────────────

const GRID = {
  spring: { type: "spring" as const, visualDuration: 0.2, bounce: 0 },
};

const TILE = {
  staggerStep: 0.02, // seconds per diagonal step (i + j)
  initialScale: 0.85, // scale before appearing
  duration: 0.2, // seconds for CSS entrance animation
};

const SHUFFLE = {
  steps: 4, // intermediate random states before final
  interval: 60, // ms between each shuffle step
};

const CONTROLS = {
  offsetY: 6,
  spring: { type: "spring" as const, visualDuration: 0.25, bounce: 0 },
};

const DESTRUCTIVE = "#c45b52";

// CSS keyframes for tile entrance — replaces per-tile motion springs
// (169 fewer JS spring instances at n=13; browser animation engine handles stagger)
const TILE_KEYFRAMES = `@keyframes tile-in{from{opacity:0;transform:scale(${TILE.initialScale})}}`;

function initState(size: number) {
  return {
    square: generateRandom(size),
    bgColors: selectRandomColors(size),
    fgColors: selectRandomColors(size),
  };
}

// ── Size selector ────────────────────────────────────────────────

function SizeSelector({ value, onChange }: { value: number; onChange: (s: number) => void }) {
  const isDestructive = IMPOSSIBLE.has(value);
  const idx = SIZES.indexOf(value);
  const accentColor = isDestructive ? DESTRUCTIVE : "var(--color-accent)";

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" && idx < SIZES.length - 1) {
        e.preventDefault();
        onChange(SIZES[idx + 1]);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        onChange(SIZES[idx - 1]);
      }
    },
    [idx, onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label="Grid size"
      onKeyDown={onKeyDown}
      className="flex items-center"
    >
      {SIZES.map((s) => {
        const impossible = IMPOSSIBLE.has(s);
        const active = s === value;
        return (
          <button
            key={s}
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(s)}
            className={cn(
              "relative flex h-8 flex-1 items-center justify-center font-mono text-2xs transition-colors duration-100 outline-none",
              impossible && "line-through decoration-muted/30",
              active ? "text-ink" : impossible ? "text-muted/30" : "text-muted hover:text-ink/60",
            )}
          >
            {active && (
              <motion.span
                layoutId="size-indicator"
                className="absolute h-7 w-7 rounded-full"
                style={{ backgroundColor: `color-mix(in oklch, ${accentColor}, transparent 85%)` }}
                transition={{ type: "spring", visualDuration: 0.15, bounce: 0 }}
              />
            )}
            <span className="relative">{s}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────

export function GraecoLatinSquares() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const sizeRef = useRef(DEFAULT_SIZE);
  const [state, setState] = useState<ReturnType<typeof initState> | null>(null);
  const [gridKey, setGridKey] = useState(0);
  const shuffleTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Generate initial state client-side only to avoid hydration mismatch (Math.random)
  useEffect(() => {
    setState(initState(DEFAULT_SIZE));
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    if (newSize === sizeRef.current) return;
    sizeRef.current = newSize;
    setSize(newSize);
    if (!IMPOSSIBLE.has(newSize)) {
      setState(initState(newSize));
      setGridKey((k) => k + 1);
    }
  }, []);

  const randomize = useCallback(() => {
    // Clear any in-progress shuffle
    shuffleTimers.current.forEach(clearTimeout);
    shuffleTimers.current = [];

    const s = sizeRef.current;
    for (let step = 0; step < SHUFFLE.steps; step++) {
      shuffleTimers.current.push(
        setTimeout(() => {
          setState(initState(s));
        }, step * SHUFFLE.interval),
      );
    }
    // Final settle
    shuffleTimers.current.push(
      setTimeout(() => {
        setState(initState(s));
      }, SHUFFLE.steps * SHUFFLE.interval),
    );
  }, []);

  // Cleanup shuffle timers on unmount
  useEffect(() => {
    return () => shuffleTimers.current.forEach(clearTimeout);
  }, []);

  const handleSavePng = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const s = sizeRef.current;
    const svgPx = s * CELL;
    const scale = Math.max(1, Math.ceil(1200 / svgPx));
    const canvasSize = svgPx * scale;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => {
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `graeco-latin-${s}x${s}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      });
      URL.revokeObjectURL(svgUrl);
    });
    img.src = svgUrl;
  }, []);

  const impossible = IMPOSSIBLE.has(size);
  const svgSize = size * CELL;
  const insetOffset = (CELL - INNER) / 2;

  return (
    <div className="flex h-full flex-col items-center justify-center px-5 py-4 sm:px-8 sm:py-6">
      <style>{TILE_KEYFRAMES}</style>
      {/* Artwork */}
      <div className="flex min-h-0 w-full max-w-2xl flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {impossible ? (
            <motion.div
              key="impossible"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={GRID.spring}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="font-serif text-4xl font-light text-muted italic">n = 6</span>
              <p className="max-w-[22ch] font-sans text-sm leading-relaxed text-muted/70">
                No orthogonal Latin square pair exists. Proved by Gaston Tarry, 1901.
              </p>
            </motion.div>
          ) : state ? (
            <motion.div
              key={`grid-${size}-${gridKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="aspect-square max-h-full w-full"
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="h-full w-full"
                style={{ contain: "content" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {Array.from({ length: size }, (_row, i) =>
                  Array.from({ length: size }, (_col, j) => {
                    const latinVal = state.square.latin[i][j];
                    const greekVal = state.square.greek[i][j];
                    const diag = i + j;
                    const cx = j * CELL + CELL / 2;
                    const cy = i * CELL + CELL / 2;
                    return (
                      <g
                        key={`cell-${i * size + j}`}
                        style={{
                          animation: `tile-in ${TILE.duration}s ease-out ${diag * TILE.staggerStep}s backwards`,
                          transformOrigin: `${cx}px ${cy}px`,
                        }}
                      >
                        <rect
                          x={j * CELL}
                          y={i * CELL}
                          width={CELL}
                          height={CELL}
                          fill={state.bgColors[latinVal]}
                        />
                        <rect
                          x={j * CELL + insetOffset}
                          y={i * CELL + insetOffset}
                          width={INNER}
                          height={INNER}
                          fill={state.fgColors[greekVal]}
                        />
                      </g>
                    );
                  }),
                )}
              </svg>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: CONTROLS.offsetY }}
        animate={{ opacity: 1, y: 0 }}
        transition={CONTROLS.spring}
        className="mt-4 w-full max-w-md sm:mt-6"
      >
        <SizeSelector value={size} onChange={handleSizeChange} />

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={randomize}
            disabled={impossible}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-medium transition-opacity",
              impossible
                ? "cursor-not-allowed bg-mid/50 text-muted/50"
                : "bg-accent text-ink-inv hover:opacity-85 active:opacity-75",
            )}
          >
            <ArrowsClockwiseIcon size={16} weight="bold" />
            Randomize
          </button>
          <button
            onClick={handleSavePng}
            disabled={impossible}
            className={cn(
              "flex items-center gap-1.5 px-2 py-2.5 font-sans text-sm transition-colors",
              impossible ? "cursor-not-allowed text-muted/30" : "text-muted hover:text-ink",
            )}
          >
            <DownloadSimpleIcon size={16} />
            Save PNG
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default GraecoLatinSquares;
