import { EnvelopeSimple, GithubLogo, XLogo } from "@phosphor-icons/react/dist/ssr";

export const SOCIAL_LINKS = [
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

export type SocialLink = (typeof SOCIAL_LINKS)[number];
