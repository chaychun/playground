import fs from "node:fs/promises";
import path from "node:path";

import { NavPill } from "@/components/nav-pill";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import type { ComponentMeta } from "@/lib/types";
import { notFound } from "next/navigation";

const playgroundDir = path.join(process.cwd(), "src", "playground");

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await fs.readdir(playgroundDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const results = await Promise.all(
    dirs.map(async (slug) => {
      try {
        const { meta } = (await import(`@/playground/${slug}/meta`)) as { meta: ComponentMeta };
        return meta.display === "preview" ? { slug } : null;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((r): r is { slug: string } => r !== null);
}

async function getMeta(slug: string): Promise<ComponentMeta | null> {
  try {
    const { meta } = (await import(`@/playground/${slug}/meta`)) as { meta: ComponentMeta };
    return meta;
  } catch {
    return null;
  }
}

export default async function PlaygroundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = await getMeta(slug);
  if (!meta || meta.display === "inline") notFound();

  if (meta.fullViewport) {
    return (
      <main className="h-svh overflow-hidden bg-paper">
        <NavPill title={meta.title} theme={meta.navTheme ?? "light"} />
        <LazyPlaygroundComponent
          slug={slug}
          fallback={
            <div className="flex h-svh items-center justify-center text-xs text-muted">
              Loading…
            </div>
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-paper">
      <NavPill title={meta.title} theme={meta.navTheme ?? "light"} />
      <header className="px-6 pt-16 pb-8">
        <p className="mb-2 font-mono text-2xs tracking-[0.08em] text-muted uppercase">Playground</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{meta.title}</h1>
      </header>
      <div className="px-6">
        <LazyPlaygroundComponent
          slug={slug}
          fallback={
            <div className="flex h-64 items-center justify-center text-xs text-muted">Loading…</div>
          }
        />
      </div>
    </main>
  );
}
