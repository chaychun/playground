import Link from "next/link";

export function BreadcrumbNav({ page }: { page: string }) {
  return (
    <nav
      className="hidden items-center gap-1.5 font-dm-mono text-[13px] tracking-[0.02em] lg:flex"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="text-ink underline-offset-2 transition-colors hover:underline hover:decoration-link"
      >
        chayut c.
      </Link>
      <span className="text-muted">/</span>
      <span className="text-dim">{page}</span>
    </nav>
  );
}
