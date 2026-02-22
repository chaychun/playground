import { PortfolioGrid } from "@/components/grid/portfolio-grid";
import { getPlaygroundItems } from "@/lib/get-playground-items";

export default async function Home() {
  const items = await getPlaygroundItems();

  return (
    <main className="min-h-svh bg-paper">
      <header className="px-6 pt-12 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">playground</h1>
      </header>
      <PortfolioGrid items={items} />
    </main>
  );
}
