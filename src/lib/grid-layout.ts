import type { GridItem } from "@/lib/types";

/**
 * Blank-column position in each row of the 5-column grid.
 * Cycles: end (col 5), middle (col 3), start (col 1), repeat.
 */
type BlankPosition = "end" | "middle" | "start";
const BLANK_CYCLE: BlankPosition[] = ["end", "middle", "start"];

export type GridPlacement = {
  item: GridItem;
  /** CSS grid-column value, e.g. "1 / 5" */
  colSpan: string;
  /** 1-indexed CSS grid-row */
  row: number;
};

/**
 * Compute grid placements for a 5-column editorial grid.
 *
 * - Portrait items span 2 columns
 * - Landscape items span 4 columns
 * - Each row has one blank column cycling through positions 5, 3, 1
 * - Landscape items only fit rows where the blank is at an end (col 5 or col 1)
 * - Date order is mostly preserved; landscape items may shift slightly
 *   to reach a compatible row.
 */
export function computeGridLayout(items: GridItem[]): GridPlacement[] {
  const placements: GridPlacement[] = [];
  const queue = [...items]; // already sorted newest-first
  const landscapeHold: GridItem[] = [];
  let row = 0;

  while (queue.length > 0 || landscapeHold.length > 0) {
    const blank = BLANK_CYCLE[row % 3];
    const canLandscape = blank !== "middle";
    const gridRow = row + 1;

    // 1. Place a held landscape item if this row supports it
    if (canLandscape && landscapeHold.length > 0) {
      placements.push({
        item: landscapeHold.shift()!,
        colSpan: landscapeCol(blank),
        row: gridRow,
      });
      row++;
      continue;
    }

    // 2. Queue empty — only held landscapes remain
    if (queue.length === 0) {
      if (landscapeHold.length > 0) {
        if (canLandscape) {
          placements.push({
            item: landscapeHold.shift()!,
            colSpan: landscapeCol(blank),
            row: gridRow,
          });
        }
        row++;
        continue;
      }
      break;
    }

    // 3. Next item is landscape
    if (queue[0].orientation === "landscape") {
      if (canLandscape) {
        placements.push({
          item: queue.shift()!,
          colSpan: landscapeCol(blank),
          row: gridRow,
        });
        row++;
      } else {
        // Hold it for a compatible row; don't advance row yet
        landscapeHold.push(queue.shift()!);
      }
      continue;
    }

    // 4. Gather up to 2 portraits, buffering any landscapes encountered
    const portraits: GridItem[] = [];
    while (queue.length > 0 && portraits.length < 2) {
      if (queue[0].orientation === "portrait") {
        portraits.push(queue.shift()!);
      } else {
        landscapeHold.push(queue.shift()!);
      }
    }

    if (portraits.length > 0) {
      const cols = portraitCols(blank);
      for (let i = 0; i < portraits.length; i++) {
        placements.push({
          item: portraits[i],
          colSpan: cols[i],
          row: gridRow,
        });
      }
      row++;
    }
  }

  return placements;
}

function landscapeCol(blank: BlankPosition): string {
  return blank === "end" ? "1 / 5" : "2 / 6";
}

function portraitCols(blank: BlankPosition): [string, string] {
  switch (blank) {
    case "end":
      return ["1 / 3", "3 / 5"];
    case "middle":
      return ["1 / 3", "4 / 6"];
    case "start":
      return ["2 / 4", "4 / 6"];
  }
}
