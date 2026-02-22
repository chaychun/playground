"use client";

import { useState } from "react";

export default function HelloCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <p className="font-mono text-xs text-muted">count</p>
      <p className="text-2xl font-semibold text-ink tabular-nums">{count}</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-ink-inv transition-colors hover:bg-dim"
      >
        Increment
      </button>
    </div>
  );
}
