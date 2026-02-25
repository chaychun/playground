import { WorkFeed } from "@/components/work-feed";
import { items } from "@/data/items";

export default function Home() {
  const sorted = items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));

  return <WorkFeed items={sorted} />;
}
