import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { type SocialLink, SOCIAL_LINKS } from "@/data/social";
import Image from "next/image";

const ABOUT_SOCIAL_LINKS: (SocialLink & { display: string })[] = [
  { ...SOCIAL_LINKS[0], display: "@chayutc_" },
  { ...SOCIAL_LINKS[1], display: "chaychun" },
  { ...SOCIAL_LINKS[2], display: "chun.chayut@gmail.com" },
];

export default function AboutPage() {
  return (
    <div className="px-5 py-6 lg:px-10 lg:py-8">
      {/* Breadcrumb — desktop only */}
      <div className="animate-in ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
        <BreadcrumbNav page="about" />
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:gap-16">
        {/* Photo + Social — top on mobile, right on desktop */}
        <div className="order-first flex shrink-0 animate-in flex-row items-start gap-4 delay-[80ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:order-last lg:flex-col lg:gap-0">
          <Image
            src="/images/profile.jpeg"
            alt="Chayut"
            width={280}
            height={280}
            className="aspect-square w-full max-w-[120px] rounded-lg object-cover lg:max-w-[280px]"
          />
          <div className="flex flex-col gap-2 lg:mt-4">
            {ABOUT_SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
              >
                <link.icon className="size-3.5 shrink-0" />
                <span>{link.display}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="max-w-xl">
          <h1 className="animate-in font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase delay-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
            ABOUT
          </h1>
          <h2 className="mt-3 animate-in font-serif text-xl font-extralight text-ink delay-[160ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:text-2xl">
            I&apos;m Chayut, a design engineer based in Thailand.
          </h2>

          <div className="mt-8 animate-in space-y-4 text-[13px] leading-relaxed text-dim delay-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2">
            <p>
              I design and build cool things with code, focusing on motion-led interactions and
              interface patterns that improve the experience of the user. I believe deeply in calm
              technology: tools that assists humans while remaining unintrusive. That&apos;s always
              the goal when I build anything.
            </p>
            <p>
              I work with both web (React) and Native (SwiftUI) platforms. My interest is more in
              the visible layer, not in the implementation, and I embrace AI coding tools in my
              workflow without compromising on quality.
            </p>
            <p>
              Outside of code, I&apos;m probably rearranging my room for the third time this month,
              deep in a rabbit hole about how people think and learn, or just enjoying a quiet
              moment with people I care about.
            </p>
          </div>

          {/* Education */}
          <section className="mt-16 animate-in delay-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] animation-duration-800 fill-mode-both fade-in slide-in-from-bottom-2 lg:mt-40">
            <h2 className="font-dm-mono text-2xs tracking-[0.08em] text-muted uppercase">
              Education
            </h2>
            <div className="mt-4">
              <p className="text-sm font-medium text-ink">B.Sc. in Physics (First Class Honours)</p>
              <p className="mt-1 text-[13px] text-dim">Mahidol University International College</p>
              <p className="mt-0.5 font-dm-mono text-2xs text-muted">Graduated 2024</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
