export const NAV_LINKS = [{ href: "/", label: "Experiments" }] as const;

export function isActiveLink(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
