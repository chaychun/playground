export default function NowPage() {
  return (
    <div className="max-w-xl pr-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Now</h1>
      <p className="mt-2 text-xs text-muted">Lorem ipsum dolor sit amet.</p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Lorem
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Ipsum
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Dolor
          </h2>
          <p className="text-sm leading-relaxed text-dim">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
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
