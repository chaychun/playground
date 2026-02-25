import type { Item } from "@/lib/types";

export const items: Item[] = [
  {
    slug: "polaroid-stack",
    title: "Polaroid Stack",
    description:
      "A draggable stack of polaroid photos with spring physics. Flick cards to shuffle the deck.",
    tags: ["Gesture", "Physics"],
    createdAt: "2026-02-25",
    preview: { type: "image", src: "/previews/polaroid-stack.png" },
    content: { type: "component" },
  },
  {
    slug: "location-pin",
    title: "Location Pin",
    description: "An animated location card with morphing pin and bounce-in entrance.",
    tags: ["Animation", "Micro-interaction"],
    createdAt: "2026-02-10",
    preview: { type: "image", src: "/previews/location-pin.png" },
    content: { type: "component" },
  },
  {
    slug: "info-modal",
    title: "Info Modal",
    description: "An expandable info card with spring-animated entrance and backdrop blur.",
    tags: ["Animation", "Micro-interaction"],
    createdAt: "2026-02-08",
    preview: { type: "image", src: "/previews/info-modal.png" },
    content: { type: "component" },
  },
  {
    slug: "page-stack",
    title: "Page Stack",
    description:
      "An editorial page-turning interaction driven by scroll position with parallax imagery.",
    tags: ["Navigation", "Scroll"],
    createdAt: "2026-02-02",
    preview: { type: "image", src: "/previews/page-stack.png" },
    content: { type: "component" },
  },
  {
    slug: "cursor-follower",
    title: "Cursor Follower",
    description:
      "A smooth cursor-tracking element with elastic easing across three interactive zones.",
    tags: ["Cursor", "Animation"],
    createdAt: "2026-01-20",
    preview: { type: "image", src: "/previews/cursor-follower.png" },
    content: { type: "component" },
  },
];
