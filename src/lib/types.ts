export type ComponentMeta = {
  title: string;
  orientation: "portrait" | "landscape";
  createdAt: string;
} & (
  | { display: "inline" }
  | { display: "preview"; preview: { type: "image" | "video"; src: string } }
);

export type LinkItem = {
  type: "external-link";
  id: string;
  title: string;
  orientation: "portrait" | "landscape";
  createdAt: string;
  preview: { type: "image" | "video"; src: string };
  href: string;
};

export type GridItem =
  | {
      type: "inline";
      slug: string;
      title: string;
      orientation: "portrait" | "landscape";
      createdAt: string;
    }
  | {
      type: "preview";
      slug: string;
      title: string;
      orientation: "portrait" | "landscape";
      createdAt: string;
      preview: { type: "image" | "video"; src: string };
    }
  | LinkItem;
