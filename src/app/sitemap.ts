import { getAllItems } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getAllItems();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const itemPages: MetadataRoute.Sitemap = items
    .filter((item) => item.hasFullPage)
    .map((item) => ({
      url: `${SITE_URL}/${item.slug}`,
      lastModified: item.createdAt ? new Date(item.createdAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...itemPages];
}
