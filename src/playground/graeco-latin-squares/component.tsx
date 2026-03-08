"use client";

import { cn } from "@/lib/cn";
import { ArrowsClockwise, DownloadSimple } from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";

import { generateRandom } from "./core";
import { selectRandomColors } from "./palette";

const SIZES = [3, 4, 5, 7, 8, 9, 10, 11, 12, 13];
const CELL = 60;
const INNER = 24;
const DEFAULT_SIZE = 5;

function initState(size: number) {
  return {
    square: generateRandom(size),
    bgColors: selectRandomColors(size),
    fgColors: selectRandomColors(size),
  };
}

export default function GraecoLatinSquares() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [{ square, bgColors, fgColors }, setState] = useState(() => initState(DEFAULT_SIZE));

  const randomize = useCallback((newSize?: number) => {
    const s = newSize ?? size;
    if (newSize !== undefined) setSize(s);
    setState(initState(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSavePng = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgSize = size * CELL;
    const scale = Math.max(1, Math.ceil(1200 / svgSize));
    const canvasSize = svgSize * scale;

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
        a.download = `graeco-latin-${size}x${size}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      });
      URL.revokeObjectURL(svgUrl);
    });
    img.src = svgUrl;
  }, [size]);

  const svgSize = size * CELL;
  const insetOffset = (CELL - INNER) / 2;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="aspect-square max-h-full max-w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {square.latin.map((row: number[], i: number) =>
            row.map((latinVal: number, j: number) => {
              const greekVal = square.greek[i][j];
              return (
                <g key={`${latinVal}-${greekVal}`}>
                  <rect
                    x={j * CELL}
                    y={i * CELL}
                    width={CELL}
                    height={CELL}
                    fill={bgColors[latinVal]}
                  />
                  <rect
                    x={j * CELL + insetOffset}
                    y={i * CELL + insetOffset}
                    width={INNER}
                    height={INNER}
                    fill={fgColors[greekVal]}
                  />
                </g>
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => randomize(s)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                s === size
                  ? "bg-accent font-medium text-ink-inv"
                  : "bg-surface text-muted hover:text-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => randomize()}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-mid hover:text-ink"
          >
            <ArrowsClockwise size={14} weight="bold" />
            Randomize
          </button>
          <button
            onClick={handleSavePng}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-mid hover:text-ink"
          >
            <DownloadSimple size={14} weight="bold" />
            Save PNG
          </button>
        </div>
      </div>
    </div>
  );
}
