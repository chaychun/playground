import type { Item } from "@/lib/types";

export const items: Item[] = [
  {
    slug: "polaroid-stack",
    title: "Polaroid Stack",
    description:
      "A draggable stack of polaroid photos with spring physics. Flick cards to shuffle the deck.",
    createdAt: "2026-02-25",
    preview: {
      type: "custom",
      component: "placeholder",
      props: { name: "Polaroid Stack" },
    },
    content: { type: "component" },
  },
  {
    slug: "location-pin",
    title: "Location Pin",
    description: "An animated location card with morphing pin and bounce-in entrance.",
    createdAt: "2026-02-10",
    preview: {
      type: "custom",
      component: "placeholder",
      props: { name: "Location Pin" },
    },
    content: { type: "component" },
  },
  {
    slug: "info-modal",
    title: "Info Modal",
    description: "An expandable info card with spring-animated entrance and backdrop blur.",
    createdAt: "2026-02-08",
    preview: {
      type: "custom",
      component: "placeholder",
      props: { name: "Info Modal" },
    },
    content: { type: "component" },
  },
  {
    slug: "page-stack",
    title: "Page Stack",
    description:
      "An editorial page-turning interaction driven by scroll position with parallax imagery.",
    createdAt: "2026-02-02",
    preview: {
      type: "custom",
      component: "placeholder",
      props: { name: "Page Stack" },
    },
    content: { type: "component" },
  },
  {
    slug: "cursor-follower",
    title: "Cursor Follower",
    description:
      "A smooth cursor-tracking element with elastic easing across three interactive zones.",
    createdAt: "2026-01-20",
    preview: {
      type: "custom",
      component: "placeholder",
      props: { name: "Cursor Follower" },
    },
    content: { type: "component" },
  },
];
