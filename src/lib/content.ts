import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { mdxComponents } from "@/lib/mdx-components";
import type { Item, PreviewConfig } from "@/lib/types";
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

async function loadLocalPreview(slug: string): Promise<PreviewConfig | null> {
  try {
    const mod = (await import(`@/playground/${slug}/preview`)) as {
      default: PreviewConfig;
    };
    return mod.default;
  } catch {
    return null;
  }
}

async function parseItem(slug: string): Promise<{ item: Item; raw: string }> {
  const filePath = join(PLAYGROUND_DIR, slug, "content.mdx");
  const source = readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  const localPreview = await loadLocalPreview(slug);
  const preview = localPreview ?? data.preview;

  const item: Item = {
    slug,
    title: data.title ?? slug,
    description: data.description,
    createdAt: data.createdAt ?? "",
    category: data.category,
    type: data.type ?? "content",
    links: data.links,
    preview,
    ...(data.type === "preview" ? { name: data.name, props: data.props } : {}),
    ...(data.type === "image" ? { src: data.src } : {}),
    ...(data.type === "video" ? { src: data.src } : {}),
  } as Item;

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
    const { content } = await compileMDX({
      source: raw,
      components: mdxComponents,
    });
    return { item, content };
  } catch {
    return null;
  }
}

export async function getPreviewBySlug(): Promise<Record<string, PreviewConfig>> {
  const items = await getAllItems();
  return Object.fromEntries(items.filter((i) => i.preview).map((i) => [i.slug, i.preview!]));
}
