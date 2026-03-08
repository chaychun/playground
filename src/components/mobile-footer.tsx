import { SOCIAL_LINKS } from "@/data/social";
import { cn } from "@/lib/cn";
import { entrance } from "@/lib/entrance";

export function MobileFooter() {
  return (
    <footer
      className={cn("border-t border-border px-5 py-5 lg:hidden", entrance({ slide: false }))}
    >
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
