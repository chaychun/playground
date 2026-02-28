import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col-reverse gap-8 px-5 py-6 md:flex-row lg:gap-10 lg:py-8 lg:pr-8 lg:pl-0">
      {/* Text content */}
      <div className="max-w-xl">
        <h1
          className="animate-fade-in-up text-2xl font-semibold tracking-tight text-ink lg:text-4xl"
          style={{ animationDelay: "0ms" }}
        >
          I&apos;m Chayut, a design engineer based in Thailand.
        </h1>

        <div
          className="mt-8 animate-fade-in-up space-y-4 text-sm leading-relaxed text-dim"
          style={{ animationDelay: "80ms" }}
        >
          <p>
            I design and build cool things with code, focusing on motion-led interactions and
            interface patterns that improve the experience of the user. I believe deeply in calm
            technology: tools that assists humans while remaining unintrusive. That&apos;s always
            the goal when I build anything.
          </p>
          <p>
            I work with both web (React) and Native (SwiftUI) platforms. My interest is more in the
            visible layer, not in the implementation, and I embrace AI coding tools in my workflow
            without compromising on quality.
          </p>
          <p>
            Outside of code, I&apos;m probably rearranging my room for the third time this month,
            deep in a rabbit hole about how people think and learn, or just enjoying a quiet moment
            with people I care about.
          </p>
        </div>

        {/* Education */}
        <section className="mt-16 animate-fade-in-up lg:mt-40" style={{ animationDelay: "160ms" }}>
          <h2 className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">Education</h2>
          <div className="mt-4">
            <p className="text-sm font-medium text-ink">B.Sc. in Physics (First Class Honours)</p>
            <p className="mt-1 text-sm text-dim">Mahidol University International College</p>
            <p className="mt-0.5 font-mono text-2xs text-muted">Graduated 2024</p>
          </div>
        </section>
      </div>

      {/* Photo */}
      <div className="shrink-0 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <Image
          src="/images/profile.jpeg"
          alt="Chayut"
          width={280}
          height={280}
          className="aspect-square w-full max-w-[200px] rounded-lg object-cover md:max-w-[280px]"
        />
      </div>
    </div>
  );
}
