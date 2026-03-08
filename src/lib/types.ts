export type ItemCategory = "exploration" | "pattern" | "case study";

export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  category?: ItemCategory;
  links?: { label: string; href: string }[];
} & (
  | { type: "interactive" }
  | { type: "preview"; name: string; props?: Record<string, unknown> }
  | { type: "image"; src: string }
  | { type: "video"; src: string }
);
