import { SOCIAL_LINKS } from "@/data/social";

export function MobileFooter() {
  return (
    <footer className="border-t border-border px-5 py-5 lg:hidden">
      <div className="flex items-center gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-ink"
            aria-label={link.label}
          >
            <link.icon className="size-3.5" />
          </a>
        ))}
      </div>
    </footer>
  );
}
