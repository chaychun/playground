export default function AboutPage() {
  return (
    <div className="max-w-xl px-10 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        I&rsquo;m a creative developer based in Bangkok.
      </h1>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-dim">
        <p>
          I build interactive experiences for the web with a focus on motion, playfulness, and
          craft. Currently exploring the intersection of design engineering and digital art.
        </p>
        <p>
          When I&rsquo;m not coding, I&rsquo;m probably obsessing over typography, taking photos of
          brutalist architecture, or making too much coffee.
        </p>
      </div>

      {/* Photo placeholder */}
      <div className="mt-10 aspect-[4/3] w-full max-w-sm rounded-lg bg-surface" />

      {/* Elsewhere */}
      <div className="mt-12 border-t border-border pt-6">
        <p className="mb-4 font-mono text-2xs tracking-[0.08em] text-muted uppercase">Elsewhere</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-link transition-colors hover:text-ink"
          >
            GitHub &rarr;
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-link transition-colors hover:text-ink"
          >
            Twitter/X &rarr;
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-link transition-colors hover:text-ink"
          >
            LinkedIn &rarr;
          </a>
          <a
            href="mailto:hello@example.com"
            className="text-sm text-link transition-colors hover:text-ink"
          >
            Email &rarr;
          </a>
        </div>
      </div>

      {/* Colophon */}
      <div className="mt-10 border-t border-border pt-6">
        <p className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">Colophon</p>
        <p className="text-xs leading-relaxed text-dim">
          Built with Next.js, TypeScript, and Tailwind CSS.
          <br />
          Set in Manrope &amp; IBM Plex Mono.
        </p>
      </div>
    </div>
  );
}
