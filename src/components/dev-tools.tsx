"use client";

import dynamic from "next/dynamic";

const DialRoot = dynamic(() => import("dialkit").then((m) => ({ default: m.DialRoot })), {
  ssr: false,
});

export function DevTools() {
  return <DialRoot position="top-right" />;
}
