import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { getAllAuthors } from "@/lib/authors";
import { slugify } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const authors = getAllAuthors();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/category`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/author`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/disclaimer`, changeFrequency: "yearly", priority: 0.2 }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories.map((c) => ({
    url: `${siteConfig.url}/category/${slugify(c)}`,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${siteConfig.url}/tag/${slugify(t)}`,
    changeFrequency: "weekly",
    priority: 0.4
  }));

  const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${siteConfig.url}/author/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.modifiedDate || p.publishedDate,
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...authorRoutes, ...postRoutes];
}
