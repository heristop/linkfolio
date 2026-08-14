import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "./lib/deployMode";
import { appUrl, isShowcase } from "./lib/siteMeta";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return buildSitemapEntries(appUrl, isShowcase).map((entry) => ({
    url: entry.url,
    priority: entry.priority,
    lastModified,
    changeFrequency: "monthly" as const,
  }));
}
