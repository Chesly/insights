import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts, getPostCategories } from "@/lib/posts";
import { getAllAuthors } from "@/lib/authors";
import { getAllDownloads } from "@/lib/downloads";
import { getAllFacts } from "@/lib/facts";
import { slugify } from "@/lib/types";
import { CALCULATORS } from "@/lib/calculators";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, authors, downloads, facts] = await Promise.all([
    getAllPosts(false, ["insights", "coffee"]),
    getAllAuthors(),
    getAllDownloads(),
    getAllFacts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/insights`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/coffee`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteConfig.url}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/calculators`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/facts`, changeFrequency: "daily", priority: 0.6 },
    { url: `${siteConfig.url}/spaza-support`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/category`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/author`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/disclaimer`, changeFrequency: "yearly", priority: 0.2 }
  ];

  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    for (const category of getPostCategories(post)) {
      const key = slugify(category);
      categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
    }
    for (const tag of post.tags) {
      const key = slugify(tag);
      const current = tagCounts.get(key);
      tagCounts.set(key, { label: current?.label || tag, count: (current?.count || 0) + 1 });
    }
  }

  // Keep thin taxonomy pages out of the sitemap. They remain usable for
  // visitors, but Google gets a cleaner crawl/index set focused on useful hubs.
  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories
    .filter((c) => (categoryCounts.get(slugify(c)) || 0) >= 2)
    .map((c) => ({
      url: `${siteConfig.url}/category/${slugify(c)}`,
      changeFrequency: "weekly",
      priority: 0.6
    }));

  const tagRoutes: MetadataRoute.Sitemap = Array.from(tagCounts.entries())
    .filter(([, value]) => value.count >= 2)
    .map(([slug]) => ({
      url: `${siteConfig.url}/tag/${slug}`,
      changeFrequency: "weekly",
      priority: 0.4
    }));

  const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${siteConfig.url}/author/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/${p.section === "coffee" ? "coffee" : "insights"}/${p.slug}`,
    lastModified: p.modifiedDate || p.publishedDate,
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const toolRoutes: MetadataRoute.Sitemap = downloads.map((d) => ({
    url: `${siteConfig.url}/tools/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.map((c) => ({
    url: `${siteConfig.url}/calculators/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const factRoutes: MetadataRoute.Sitemap = facts.map((f) => ({
    url: `${siteConfig.url}/facts/${f.slug}`,
    lastModified: f.updated_at,
    changeFrequency: "yearly",
    priority: 0.5
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...authorRoutes, ...postRoutes, ...toolRoutes, ...calculatorRoutes, ...factRoutes];
}
