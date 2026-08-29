import type { MetadataRoute } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostsByTag } from "@/lib/posts";
import { getFactsByCategory } from "@/lib/facts";

// Served at /lcdkhaya/sitemap.xml (and at lcdkhaya.co.za/sitemap.xml once
// DNS is pointed, via the middleware host rewrite). Kept separate from
// the main sitemap.ts because a sitemap's URLs must share its own host —
// mixing lcdkhaya.co.za URLs into the insights.chesly.tech sitemap would
// violate the sitemap protocol.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, facts] = await Promise.all([
    getPostsByTag(lcdKhayaConfig.blogTag),
    getFactsByCategory(lcdKhayaConfig.factsCategory)
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: lcdKhayaConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${lcdKhayaConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${lcdKhayaConfig.url}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${lcdKhayaConfig.url}/gallery`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${lcdKhayaConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${lcdKhayaConfig.url}/facts`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${lcdKhayaConfig.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${lcdKhayaConfig.url}/booking`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${lcdKhayaConfig.url}/testimonials`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${lcdKhayaConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${lcdKhayaConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 }
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${lcdKhayaConfig.url}/blog/${p.slug}`,
    lastModified: p.modifiedDate || p.publishedDate,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const factRoutes: MetadataRoute.Sitemap = facts.map((f) => ({
    url: `${lcdKhayaConfig.url}/facts/${f.slug}`,
    lastModified: f.updated_at,
    changeFrequency: "yearly",
    priority: 0.5
  }));

  return [...staticRoutes, ...postRoutes, ...factRoutes];
}
