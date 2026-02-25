import { SidebarNav } from "@/components/sidebar-nav";

export function SidebarDefault() {
  return (
    <>
      <div>
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Chayut
            <br />
            Kulsomboon
          </h1>
          <p className="mt-1.5 text-xs text-muted">Creative Developer</p>
        </div>

        <p className="mb-8 max-w-[220px] text-xs leading-relaxed text-dim">
          Building interactive experiences for the web — motion, craft, and playfulness.
        </p>

        {/* Separator */}
        <div className="mb-6 h-px w-10 bg-mid" />

        {/* Navigation */}
        <SidebarNav />
      </div>

      {/* Bottom */}
      <div>
        <div className="mb-4 h-px w-10 bg-mid" />
        <div className="flex gap-4 font-mono text-2xs text-link">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Twitter/X
          </a>
          <a href="mailto:hello@example.com" className="transition-colors hover:text-ink">
            Email
          </a>
        </div>
      </div>
    </>
  );
}
