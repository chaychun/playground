export type Item = {
  slug: string;
  title: string;
  description: string;

  createdAt: string;
  preview:
    | { type: "image"; src: string }
    | { type: "video"; src: string }
    | { type: "custom"; component?: string; props?: Record<string, unknown> };
  content: { type: "component" } | { type: "external"; href: string };
};
