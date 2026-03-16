import { EnvelopeSimple, GithubLogo, ThreadsLogo } from "@phosphor-icons/react/dist/ssr";

export const SOCIAL_LINKS = [
  {
    icon: ThreadsLogo,
    href: "https://www.threads.com/@chun.chayut",
    label: "Threads",
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
