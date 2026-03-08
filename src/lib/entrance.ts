/**
 * Generates CSS class string for the standard entrance animation.
 * Combines animate-in with fade + optional slide, consistent easing, and staggerable delay.
 */
export function entrance(
  options: {
    delay?: number;
    duration?: number;
    slide?: "bottom-2" | "left-1" | false;
  } = {},
): string {
  const { delay, duration = 700, slide = "bottom-2" } = options;
  return [
    "animate-in",
    "fade-in",
    slide && `slide-in-from-${slide}`,
    "ease-[cubic-bezier(0.16,1,0.3,1)]",
    `animation-duration-${duration}`,
    "fill-mode-both",
    delay != null && `delay-[${delay}ms]`,
  ]
    .filter(Boolean)
    .join(" ");
}
