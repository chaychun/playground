import type { StaticImageData } from "next/image";

export type ItemCategory = "exploration" | "pattern" | "case study";
export const DEFAULT_CATEGORY: ItemCategory = "exploration";

export type PreviewSrc = string | StaticImageData;

export type PreviewConfig = {
  src: PreviewSrc | PreviewSrc[];
  interval?: number;
  fit?: "cover" | "contain";
  position?: string;
  padding?: number;
  bg?: string;
};

export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  category?: ItemCategory;
  links?: { label: string; href: string }[];
  preview?: PreviewConfig;
} & (
  | { type: "interactive" }
  | { type: "content" }
  | { type: "preview"; name: string; props?: Record<string, unknown> }
  | { type: "image"; src: string }
  | { type: "video"; src: string }
);
