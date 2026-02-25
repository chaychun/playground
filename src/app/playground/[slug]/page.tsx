import { Sidebar } from "@/components/sidebar";
import { SidebarDetail } from "@/components/sidebar-detail";
import { items } from "@/data/items";
import { LazyPlaygroundComponent } from "@/lib/lazy-component";
import { notFound } from "next/navigation";

const componentItems = items
  .filter((item) => item.content.type === "component")
  .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));

export const dynamicParams = false;

export function generateStaticParams() {
  return componentItems.map((item) => ({ slug: item.slug }));
}

export default async function PlaygroundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = componentItems.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const item = componentItems[index];
  const prev = componentItems[index - 1];
  const next = componentItems[index + 1];

  return (
    <div className="flex min-h-svh bg-paper">
      <Sidebar>
        <SidebarDetail item={item} prev={prev} next={next} />
      </Sidebar>
      <main className="h-svh min-w-0 flex-1 overflow-hidden">
        <LazyPlaygroundComponent
          slug={slug}
          fallback={
            <div className="flex h-svh items-center justify-center text-xs text-muted">
              Loading&hellip;
            </div>
          }
        />
      </main>
    </div>
  );
}
