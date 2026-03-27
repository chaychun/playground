import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { mdxComponents } from "@/lib/mdx-components";
import type { Item } from "@/lib/types";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

const PLAYGROUND_DIR = join(process.cwd(), "src/playground");

function getContentSlugs(): string[] {
  return readdirSync(PLAYGROUND_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => {
      try {
        readFileSync(join(PLAYGROUND_DIR, slug, "content.mdx"), "utf-8");
        return true;
      } catch {
        return false;
      }
    });
}

function hasBodyContent(raw: string): boolean {
  const stripped = raw.replace(/^import\s+[^\n]*\n?/gm, "").trim();
  return stripped.length > 0;
}

async function parseItem(slug: string): Promise<{ item: Item; raw: string }> {
  const filePath = join(PLAYGROUND_DIR, slug, "content.mdx");
  const source = readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  const previewTsxPath = join(PLAYGROUND_DIR, slug, "preview.tsx");
  const hasPreview = existsSync(previewTsxPath);

  let previewFrame: Item["previewFrame"];
  if (hasPreview) {
    try {
      const mod = (await import(`@/playground/${slug}/preview`)) as {
        frame?: Item["previewFrame"];
      };
      previewFrame = mod.frame;
    } catch {
      // preview.tsx exists but failed to import; hasPreview stays true
    }
  }

  const body = hasBodyContent(content) ? content.trim() : undefined;

  const item: Item = {
    slug,
    title: data.title ?? slug,
    createdAt: data.createdAt ?? "",
    ...(body ? { body } : {}),
    hasPreview,
    hasFullPage: !!body,
    ...(previewFrame ? { previewFrame } : {}),
  };

  return { item, raw: content };
}

export async function getAllItems(): Promise<Item[]> {
  const slugs = getContentSlugs();
  const items = await Promise.all(slugs.map(async (slug) => (await parseItem(slug)).item));
  return items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getItemBySlug(
  slug: string,
): Promise<{ item: Item; content: React.ReactElement } | null> {
  try {
    const { item, raw } = await parseItem(slug);

    // Collect PascalCase named exports from the slug's component files.
    const hasComponents = existsSync(join(PLAYGROUND_DIR, slug, "components.ts"));
    const barrelMod = hasComponents
      ? await import(`@/playground/${slug}/components`).catch(() => null)
      : null;

    const slugComponents: Record<string, React.ComponentType> = {};
    if (barrelMod) {
      for (const [name, value] of Object.entries(barrelMod)) {
        if (name !== "default" && /^[A-Z]/.test(name)) {
          slugComponents[name] = value as React.ComponentType;
        }
      }
    }
    const components = { ...mdxComponents, ...slugComponents };

    const { content } = await compileMDX({
      source: raw,
      components,
    });
    return { item, content };
  } catch {
    return null;
  }
}
