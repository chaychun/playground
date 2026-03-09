import { type SocialLink, SOCIAL_LINKS } from "@/data/social";
import { inlineLink } from "@/lib/styles";
import Link from "next/link";

const ABOUT_SOCIAL_LINKS: (SocialLink & { display: string })[] = [
  { ...SOCIAL_LINKS[0], display: "@chayutc_" },
  { ...SOCIAL_LINKS[1], display: "chaychun" },
  { ...SOCIAL_LINKS[2], display: "chun.chayut@gmail.com" },
];

export default function AboutPage() {
  return (
    <div className="stagger-entrance px-5 pt-10 pb-6 lg:ml-[var(--panel-split)] lg:h-full lg:overflow-y-auto lg:px-8 lg:pt-24 lg:pb-10 xl:px-12">
      <div className="max-w-lg space-y-4 text-[13px] leading-relaxed text-dim">
        <p>
          I design and build cool things with code, focusing on motion-led interactions and
          interface patterns that improve the experience of the user. I believe deeply in calm
          technology: tools that assist humans while remaining unintrusive. That&apos;s always the
          goal when I build anything.
        </p>
        <p>
          I work with both web (React) and Native (SwiftUI) platforms. My interest is more in the
          visible layer, not in the implementation, and I embrace AI coding tools in my workflow
          without compromising on quality.
        </p>
        <p>
          Outside of code, I&apos;m probably rearranging my room for the third time this month, deep
          in a rabbit hole about how people think and learn, or just enjoying a quiet moment with
          people I care about.
        </p>
        <p>
          I&apos;m currently open for design and engineering work. If you&apos;re interested in
          working with me, check out my{" "}
          <Link href="/resume" className={inlineLink}>
            resume
          </Link>{" "}
          and feel free to reach out!
        </p>
      </div>

      <div className="mt-8 flex max-w-lg flex-col gap-2">
        {ABOUT_SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent"
          >
            <link.icon className="size-3.5 shrink-0" />
            <span>{link.display}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
