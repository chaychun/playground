export const NAV_LINKS = [
  { href: "/", label: "Experiments" },
  { href: "/about", label: "About" },
  // { href: "/now", label: "Now" }, // temporarily hidden until content is ready
] as const;

export function isActiveLink(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
