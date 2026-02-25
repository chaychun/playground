export default function NowPage() {
  return (
    <div className="max-w-xl px-10 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Now</h1>
      <p className="mt-2 text-xs text-muted">What I&rsquo;m focused on at this point in my life.</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Building
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            Interactive components and experiments for this portfolio. Exploring spring physics,
            gesture interactions, and scroll-driven animations.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Learning
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            Deeper into motion design principles. Reading about animation choreography and timing
            curves.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Inspired by
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            The craft of studios like Basement, Resn, and Active Theory. The quiet confidence of
            Swiss design. Japanese attention to detail.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <p className="text-2xs text-muted">
          This page is inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline decoration-border underline-offset-2 transition-colors hover:text-ink"
          >
            the /now movement
          </a>
          .
        </p>
      </div>
    </div>
  );
}
