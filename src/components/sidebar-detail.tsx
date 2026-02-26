import { SidebarFooter } from "@/components/sidebar-footer";
import type { Item } from "@/lib/types";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function formatDate(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function SidebarDetail({ item }: { item: Item }) {
  return (
    <>
      {/* Top: back + title + date */}
      <div>
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-link transition-colors hover:text-ink"
        >
          <ArrowLeft
            weight="bold"
            className="size-3 transition-transform group-hover:-translate-x-0.5"
          />
          Back
        </Link>

        <div className="mt-10">
          <h1 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h1>
          <p className="mt-1 font-mono text-2xs text-muted">{formatDate(item.createdAt)}</p>

          <p className="mt-6 max-w-[240px] text-xs leading-relaxed text-dim">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <SidebarFooter />
    </>
  );
}
