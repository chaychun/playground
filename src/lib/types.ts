export type ItemCategory = "playground" | "exploration";
export const DEFAULT_CATEGORY: ItemCategory = "playground";

export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  category?: ItemCategory;
  links?: { label: string; href: string }[];
  hasPreview: boolean;
  hasFullPage: boolean;
  previewFrame?: { size?: number; aspectRatio?: string; minHeight?: number };
};
