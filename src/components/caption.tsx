import type { ReactNode } from "react";

export function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-2 font-mono text-body-sm text-muted">{children}</p>;
}
