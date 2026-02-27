import { XLogo, GithubLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

const SOCIAL_LINKS = [
  {
    icon: XLogo,
    href: "https://x.com/chunchayut",
    label: "X (Twitter)",
  },
  {
    icon: GithubLogo,
    href: "https://github.com/chaychun",
    label: "GitHub",
  },
  {
    icon: EnvelopeSimple,
    href: "mailto:chun.chayut@gmail.com",
    label: "Email",
  },
] as const;

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
