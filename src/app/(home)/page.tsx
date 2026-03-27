import { SocialLinks } from "@/components/social-links";
import Link from "next/link";

const highlightLink = "text-ink no-underline hand-drawn-underline";

export default function Home() {
  return (
    <div className="entrance pt-8 pb-16">
      <div className="space-y-5 text-body text-dim">
        <p>
          I&apos;m Chayut. I design &amp; build stuff. You can see some of my work in the{" "}
          <Link href="/playground" className={highlightLink}>
            playground
          </Link>
          .
        </p>
        <p>
          I focus on motion-led interactions and interface patterns that feel intentionally crafted.
          I work with both web (React) and native (SwiftUI), and I embrace AI coding tools without
          compromising on quality.
        </p>
        <p>
          I believe deeply in calm technology: tools that assist humans while remaining unintrusive.
          That&apos;s always the goal when I build anything.
        </p>
        <p>
          Outside of code, I&apos;m probably rearranging my room for the third time this month, deep
          in a rabbit hole about how people think and learn, or just enjoying a quiet moment with
          people I care about.
        </p>
      </div>
      <div className="mt-8">
        <SocialLinks />
      </div>
    </div>
  );
}
