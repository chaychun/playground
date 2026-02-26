export type Item = {
  slug: string;
  title: string;
  description: string;

  createdAt: string;
  preview: { type: "image"; src: string } | { type: "video"; src: string } | { type: "custom" };
  content: { type: "component" } | { type: "external"; href: string };
};
