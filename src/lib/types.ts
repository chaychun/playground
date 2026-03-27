export type Item = {
  slug: string;
  title: string;
  createdAt: string;
  body?: string;
  hasPreview: boolean;
  hasFullPage: boolean;
  previewFrame?: { size?: number; aspectRatio?: string; minHeight?: number };
};
