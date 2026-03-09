export type ItemCategory = "exploration" | "pattern" | "case study";
export const DEFAULT_CATEGORY: ItemCategory = "exploration";

export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  category?: ItemCategory;
  links?: { label: string; href: string }[];
  panelWidth?: { minPanelPx: number; panelPercent: number };
  previewSrc?: string;
} & (
  | { type: "interactive" }
  | { type: "content" }
  | { type: "preview"; name: string; props?: Record<string, unknown> }
  | { type: "image"; src: string }
  | { type: "video"; src: string }
);
