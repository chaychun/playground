import { HomePage } from "@/components/home-page";
import { items } from "@/data/items";

export default function Home() {
  const sorted = items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));

  return <HomePage items={sorted} />;
}
