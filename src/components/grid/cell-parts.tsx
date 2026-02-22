import type { GridItem } from "@/lib/types";
import type { ReactNode } from "react";

type Orientation = GridItem["orientation"];

/**
 * Returns the aspect-ratio class for a grid cell based on orientation.
 */
export function aspectClass(orientation: Orientation): string {
  return orientation === "portrait" ? "aspect-[3/4]" : "aspect-video";
}

type CellCaptionProps = {
  title: string;
  action?: ReactNode;
};

/**
 * Caption bar rendered below every grid cell: title on the left,
 * optional action label (e.g. "VIEW >" or "VISIT ↗") on the right.
 */
export function CellCaption({ title, action }: CellCaptionProps) {
  return (
    <div className="flex items-baseline justify-between pt-1.5">
      <p className="text-xs font-medium tracking-wide text-ink">{title}</p>
      {action}
    </div>
  );
}

/**
 * Action label shown in preview and external-link cells.
 * Renders an uppercase monospace label with an icon that highlights on group hover.
 */
export function CellAction({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <span className="flex items-center gap-1 font-mono text-2xs tracking-wide text-muted uppercase transition-colors group-hover:text-ink">
      {label}
      {icon}
    </span>
  );
}
