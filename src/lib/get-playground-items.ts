import fs from "node:fs/promises";
import path from "node:path";

import type { ComponentMeta, GridItem } from "@/lib/types";

const playgroundDir = path.join(process.cwd(), "src", "playground");

export async function getPlaygroundItems(): Promise<GridItem[]> {
  let dirs: string[] = [];
  try {
    const entries = await fs.readdir(playgroundDir, { withFileTypes: true });
    dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    // src/playground/ doesn't exist yet
    return [];
  }

  const results = await Promise.all(
    dirs.map(async (slug): Promise<GridItem | null> => {
      try {
        const { meta } = (await import(`@/playground/${slug}/meta`)) as { meta: ComponentMeta };

        if (meta.display === "preview") {
          return {
            type: "preview" as const,
            slug,
            title: meta.title,
            orientation: meta.orientation,
            createdAt: meta.createdAt,
            preview: meta.preview,
          };
        }

        return {
          type: "inline" as const,
          slug,
          title: meta.title,
          orientation: meta.orientation,
          createdAt: meta.createdAt,
        };
      } catch {
        // eslint-disable-next-line no-console -- intentional diagnostic for broken playground items
        console.warn(`Skipping playground item "${slug}": failed to load meta.ts`);
        return null;
      }
    }),
  );
  const components = results.filter((item): item is GridItem => item !== null);

  const { links } = await import("@/data/links");
  const all: GridItem[] = [...components, ...links];
  all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return all;
}
