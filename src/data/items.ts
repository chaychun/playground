import type { Item } from "@/lib/types";

export const DEFAULT_PANEL_WIDTH = { minPanelPx: 400, panelPercent: 50 };

export const items: Item[] = [
  {
    slug: "graeco-latin-squares",
    type: "interactive",
    title: "Graeco-Latin Squares",
    description: "Randomized patterns from orthogonal Latin square constructions",
    createdAt: "2026-03-09",
    category: "exploration",
  },
  {
    slug: "modifier-keys",
    type: "interactive",
    title: "Modifier Keys",
    description: "Hold modifier keys to see what Enter does",
    createdAt: "2026-03-06",
    category: "pattern",
    panelWidth: { minPanelPx: 480, panelPercent: 45 },
    previewSrc: "/previews/modifier-keys.webp",
  },
  {
    slug: "voice-capture",
    type: "interactive",
    title: "Voice Capture",
    description: "A mobile navigation pattern with an expandable voice capture pane.",
    createdAt: "2026-03-02",
    category: "exploration",
    panelWidth: { minPanelPx: 400, panelPercent: 40 },
    previewSrc: "/previews/voice-capture.webp",
  },
  {
    slug: "polaroid-carousel",
    type: "interactive",
    title: "Polaroid Carousel",
    description: "A stack of cards that expands into a gesture-based carousel modal.",
    createdAt: "2026-02-25",
    category: "exploration",
    panelWidth: { minPanelPx: 480, panelPercent: 50 },
    previewSrc: "/previews/polaroid-carousel.webp",
  },
  {
    slug: "info-modal",
    type: "interactive",
    title: "Info Modal",
    description: "An expandable info card with spring-animated entrance and backdrop blur.",
    createdAt: "2026-02-08",
    category: "pattern",
    panelWidth: { minPanelPx: 400, panelPercent: 45 },
    previewSrc: "/previews/info-modal.webp",
  },
];

/** slug → panelWidth, for client-side layout shell */
export const panelWidthBySlug: Record<string, { minPanelPx: number; panelPercent: number }> =
  Object.fromEntries(
    items.filter((item) => item.panelWidth).map((item) => [item.slug, item.panelWidth!]),
  );

/** slug → previewSrc, for client-side preview panel */
export const previewSrcBySlug: Record<string, string> = Object.fromEntries(
  items.filter((item) => item.previewSrc).map((item) => [item.slug, item.previewSrc!]),
);
