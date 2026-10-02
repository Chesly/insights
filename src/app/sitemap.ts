import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts, getAllCategories, getPopularTags } from "@/lib/posts";
import { getAllAuthors } from "@/lib/authors";
import { getAllDownloads } from "@/lib/downloads";
import { getAllFacts } from "@/lib/facts";
import { slugify } from "@/lib/types";
import { CALCULATORS } from "@/lib/calculators";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, authors, downloads, facts] = await Promise.all([
    getAllPosts(false, ["insights", "coffee"]),
    getAllCategories(),
    getPopularTags(1000),
    getAllAuthors(),
    getAllDownloads(),
    getAllFacts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/insights`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/tools`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/calculators`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/facts`, changeFrequency: "daily", priority: 0.6 },
    { url: `${siteConfig.url}/spaza-support`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/category`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/author`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/disclaimer`, changeFrequency: "yearly", priority: 0.2 }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteConfig.url}/category/${slugify(c)}`,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  // Keep thin one-article tag archives out of the sitemap. They add little search value.
  const tagRoutes: MetadataRoute.Sitemap = tags.filter((t) => t.count >= 2).map((t) => ({
    url: `${siteConfig.url}/tag/${slugify(t.tag)}`,
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
    priority: 0.6
  }));

  const factRoutes: MetadataRoute.Sitemap = facts.map((f) => ({
    url: `${siteConfig.url}/facts/${f.slug}`,
    lastModified: f.updated_at,
    changeFrequency: "yearly",
    priority: 0.5
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...authorRoutes, ...postRoutes, ...toolRoutes, ...calculatorRoutes, ...factRoutes];
}
