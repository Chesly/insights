import type { MetadataRoute } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getPostsByTag } from "@/lib/posts";
import { getCategories, getAllProducts } from "@/lib/primehealthmeds/catalog";

// Served at /primehealthmeds/sitemap.xml (and primehealthmeds.co.za/sitemap.xml
// once DNS is pointed) — mirrors src/app/lcdkhaya/sitemap.ts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, products] = await Promise.all([
    getPostsByTag(cfg.blogTag),
    getCategories(),
    getAllProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: cfg.url, changeFrequency: "weekly", priority: 1 },
    { url: `${cfg.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${cfg.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${cfg.url}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${cfg.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${cfg.url}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${cfg.url}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${cfg.url}/product/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${cfg.url}/blog/${p.slug}`,
    lastModified: p.modifiedDate || p.publishedDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
}
