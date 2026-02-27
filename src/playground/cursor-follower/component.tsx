"use client";

import { cn } from "@/lib/cn";
import { useMemo, useRef, useState } from "react";

import {
  CursorTooltip,
  useCursorFollower,
  useDarkMode,
  type CursorVariant,
  type SpringConfig,
} from "./shared";

type Mode = "physics" | "duration";

const PRESETS: Record<string, SpringConfig> = {
  bouncy: { stiffness: 150, damping: 15, mass: 1.0 },
  smooth: { stiffness: 500, damping: 60, mass: 0.8 },
  snappy: { stiffness: 300, damping: 30, mass: 1.0 },
};

function simulateSpring(config: SpringConfig, steps = 250, dt = 0.008): number[] {
  const { stiffness: k, damping: c, mass: m } = config;
  let pos = 0;
  let vel = 0;
  const points: number[] = [];
  for (let i = 0; i < steps; i++) {
    const force = -k * (pos - 1) - c * vel;
    vel += (force / m) * dt;
    pos += vel * dt;
    points.push(pos);
  }
  return points;
}

function SpringGraph({ config, isDark }: { config: SpringConfig; isDark: boolean }) {
  const points = useMemo(() => simulateSpring(config), [config]);

  const w = 240;
  const h = 96;
  const pad = { t: 8, b: 8, l: 20, r: 8 };
  const gw = w - pad.l - pad.r;
  const gh = h - pad.t - pad.b;

  const rawMax = Math.max(1.15, ...points);
  const rawMin = Math.min(-0.15, ...points);
  const yMax = Math.min(rawMax, 2.5);
  const yMin = Math.max(rawMin, -1.5);
  const yRange = yMax - yMin;

  const toX = (i: number) => pad.l + (i / (points.length - 1)) * gw;
  const toY = (v: number) => pad.t + ((yMax - Math.max(yMin, Math.min(yMax, v))) / yRange) * gh;

  const d = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  const targetY = toY(1);
  const zeroY = toY(0);
  const gridColor = isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)";
  const refColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const curveColor = isDark ? "#7da0cc" : "#4a6fa5";
  const labelColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";

  const gridYs: number[] = [];
  for (let v = Math.ceil(yMin / 0.5) * 0.5; v <= yMax; v += 0.5) {
    if (Math.abs(v) < 0.01 || Math.abs(v - 1) < 0.01) continue;
    gridYs.push(v);
  }

  const fillD = `${d} L${toX(points.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${toX(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="springCurveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={curveColor} stopOpacity={0.1} />
          <stop offset="100%" stopColor={curveColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      {gridYs.map((v) => (
        <line
          key={v}
          x1={pad.l}
          y1={toY(v)}
          x2={w - pad.r}
          y2={toY(v)}
          stroke={gridColor}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <line
        x1={pad.l}
        y1={zeroY}
        x2={w - pad.r}
        y2={zeroY}
        stroke={refColor}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={pad.l - 3}
        y={zeroY}
        textAnchor="end"
        dominantBaseline="middle"
        fill={labelColor}
        style={{ fontSize: 5.5, fontFamily: "monospace" }}
      >
        0
      </text>
      <line
        x1={pad.l}
        y1={targetY}
        x2={w - pad.r}
        y2={targetY}
        stroke={refColor}
        strokeDasharray="2 2"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={pad.l - 3}
        y={targetY}
        textAnchor="end"
        dominantBaseline="middle"
        fill={labelColor}
        style={{ fontSize: 5.5, fontFamily: "monospace" }}
      >
        1
      </text>
      <path d={fillD} fill="url(#springCurveFill)" />
      <path
        d={d}
        fill="none"
        stroke={curveColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={toX(points.length - 1)}
        cy={toY(points[points.length - 1])}
        r="2"
        fill={curveColor}
      />
    </svg>
  );
}

function fmt(v: number, step: number) {
  const decimals = step < 0.01 ? 2 : step < 1 ? 1 : 0;
  return v.toFixed(decimals);
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-2xs text-muted">{label}</span>
        <span className="font-mono text-2xs font-medium text-ink tabular-nums">
          {fmt(value, step)}
        </span>
      </div>
      <div className="relative py-0.5">
        <div className="pointer-events-none absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-border">
          <div className="h-full rounded-full bg-mid" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-3 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
    </div>
  );
}

export default function CursorFollowerDemo() {
  const isDark = useDarkMode();

  const [mode, setMode] = useState<Mode>("physics");
  const [stiffness, setStiffness] = useState(500);
  const [damping, setDamping] = useState(60);
  const [mass, setMass] = useState(0.8);
  const [duration, setDuration] = useState(0.5);
  const [bounce, setBounce] = useState(0.25);
  const [monotone, setMonotone] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const springConfig = useMemo<SpringConfig>(() => {
    if (mode === "physics") {
      return { stiffness, damping, mass };
    }
    const omega = (2 * Math.PI) / duration;
    const zeta = 1 - bounce;
    return {
      stiffness: omega * omega,
      damping: 2 * zeta * omega,
      mass: 1,
    };
  }, [mode, stiffness, damping, mass, duration, bounce]);

  const { containerRef, isVisible, data, x, y, handleEnter, handleLeave } =
    useCursorFollower(springConfig);

  // Track active zone colors so monotone/theme changes apply immediately
  const activeColorsRef = useRef<{ light: string; dark: string } | null>(null);

  const onZoneEnter = (label: string, variant: CursorVariant, light: string, dark: string) => {
    activeColorsRef.current = { light, dark };
    const c = monotone ? (isDark ? "#a8a7a2" : "#4a4a47") : isDark ? dark : light;
    handleEnter(label, variant, c);
  };

  // Compute reactive tooltip color (updates when monotone/theme changes mid-hover)
  const tooltipColor = activeColorsRef.current
    ? monotone
      ? isDark
        ? "#a8a7a2"
        : "#4a4a47"
      : isDark
        ? activeColorsRef.current.dark
        : activeColorsRef.current.light
    : (data?.color ?? "");

  const tooltipData = data ? { ...data, color: tooltipColor } : null;

  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    setMode("physics");
    setStiffness(p.stiffness);
    setDamping(p.damping);
    setMass(p.mass);
    setActivePreset(name);
  };

  const clearPreset = () => setActivePreset(null);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-paper p-3">
      <div className="grid h-full grid-cols-5 grid-rows-2 gap-3">
        {/* ── Big cell: Spring controller ── */}
        <div
          className="group relative col-span-3 row-span-2 flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors duration-200"
          onMouseEnter={() => onZoneEnter("Tweak", "pointer", "#4a6fa5", "#7da0cc")}
          onMouseLeave={handleLeave}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: isDark ? "rgba(125, 160, 204, 0.03)" : "rgba(74, 111, 165, 0.02)",
            }}
          />

          {/* Mode toggle */}
          <div className="relative flex gap-0.5 rounded-md bg-paper p-0.5">
            {(["physics", "duration"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  clearPreset();
                }}
                className={cn(
                  "flex-1 rounded px-2.5 py-0.5 font-mono text-2xs font-medium capitalize transition-all duration-150",
                  mode === m ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-dim",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Graph */}
          <div className="relative my-auto py-1">
            <SpringGraph config={springConfig} isDark={isDark} />
          </div>

          {/* Sliders */}
          <div className="relative flex flex-col gap-2.5">
            {mode === "physics" ? (
              <>
                <Slider
                  label="stiffness"
                  value={stiffness}
                  min={50}
                  max={1000}
                  step={10}
                  onChange={(v) => {
                    setStiffness(v);
                    clearPreset();
                  }}
                />
                <Slider
                  label="damping"
                  value={damping}
                  min={1}
                  max={100}
                  step={1}
                  onChange={(v) => {
                    setDamping(v);
                    clearPreset();
                  }}
                />
                <Slider
                  label="mass"
                  value={mass}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onChange={(v) => {
                    setMass(v);
                    clearPreset();
                  }}
                />
              </>
            ) : (
              <>
                <Slider
                  label="duration"
                  value={duration}
                  min={0.1}
                  max={2}
                  step={0.05}
                  onChange={(v) => {
                    setDuration(v);
                    clearPreset();
                  }}
                />
                <Slider
                  label="bounce"
                  value={bounce}
                  min={0}
                  max={0.99}
                  step={0.01}
                  onChange={(v) => {
                    setBounce(v);
                    clearPreset();
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* ── Small top: Monotone toggle ── */}
        <div
          className="group relative col-span-2 flex flex-col justify-center rounded-xl border border-border bg-surface px-5 transition-colors duration-200"
          onMouseEnter={() => onZoneEnter("Toggle", "expand", "#6b4cb0", "#9b7de0")}
          onMouseLeave={handleLeave}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: isDark ? "rgba(155, 125, 224, 0.03)" : "rgba(107, 76, 176, 0.02)",
            }}
          />
          <div className="relative flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Monotone</span>
            <button
              onClick={() => setMonotone(!monotone)}
              className={cn(
                "h-[22px] w-[40px] rounded-full p-[3px] transition-colors duration-200",
                monotone ? "bg-ink" : "bg-border",
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full bg-paper shadow-sm transition-transform duration-200",
                  monotone && "translate-x-[18px]",
                )}
              />
            </button>
          </div>
          <p className="relative mt-1.5 font-mono text-2xs text-muted">Disable tooltip color</p>
        </div>

        {/* ── Small bottom: Presets ── */}
        <div
          className="group relative col-span-2 flex flex-col justify-center rounded-xl border border-border bg-surface px-5 transition-colors duration-200"
          onMouseEnter={() => onZoneEnter("Apply", "arrow", "#b87a08", "#e8a820")}
          onMouseLeave={handleLeave}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: isDark ? "rgba(232, 168, 32, 0.03)" : "rgba(184, 122, 8, 0.02)",
            }}
          />
          <span className="relative mb-2 font-mono text-2xs font-medium tracking-wider text-muted uppercase">
            Presets
          </span>
          <div className="relative flex gap-1.5">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-1.5 font-mono text-2xs font-medium capitalize transition-all duration-150",
                  activePreset === name
                    ? "bg-ink text-ink-inv"
                    : "bg-paper text-dim hover:text-ink",
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CursorTooltip isVisible={isVisible} data={tooltipData} x={x} y={y} />
    </div>
  );
}
