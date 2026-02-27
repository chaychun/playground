export type Item = {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  links?: { label: string; href: string }[];
} & (
  | { type: "interactive" }
  | { type: "preview"; name: string; props?: Record<string, unknown> }
  | { type: "image"; src: string }
  | { type: "video"; src: string }
);
