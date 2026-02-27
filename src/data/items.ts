import type { Item } from "@/lib/types";

export const items: Item[] = [
  {
    slug: "polaroid-stack",
    type: "interactive",
    title: "Polaroid Stack",
    description:
      "A draggable stack of polaroid photos with spring physics. Flick cards to shuffle the deck. Each card responds to pointer velocity and direction, creating a natural tossing gesture that cycles through the stack.",
    createdAt: "2026-02-25",
    links: [{ label: "GitHub", href: "https://github.com/chaychun/polaroid-stack" }],
  },
  {
    slug: "info-modal",
    type: "interactive",
    title: "Info Modal",
    description: "An expandable info card with spring-animated entrance and backdrop blur.",
    createdAt: "2026-02-08",
  },
  {
    slug: "page-stack",
    type: "interactive",
    title: "Page Stack",
    description:
      "An editorial page-turning interaction driven by scroll position with parallax imagery.",
    createdAt: "2026-02-02",
  },
  {
    slug: "cursor-follower",
    type: "interactive",
    title: "Cursor Follower",
    description:
      "A smooth cursor-tracking element with elastic easing across three interactive zones.",
    createdAt: "2026-01-20",
  },
];
