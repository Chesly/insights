import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { primeHealthMedsConfig as cfg } from "./config";
import type { Product, Category } from "@/types";

// Server-side data access for the Prime Health Meds storefront — reads
// the shared `products`/`categories` tables scoped to this client's
// `site`. Any future physical-goods client reuses these same tables with
// its own `site` slug rather than a new catalog module.

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("site", cfg.catalogSite)
    .order("name");
  if (error || !data) return [];
  return data;
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) || null;
});

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug,color,icon)")
    .eq("site", cfg.catalogSite)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) || null;
});

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  const all = await getAllProducts();
  return all.filter((p) => p.category_id === category.id);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const others = all.filter((p) => p.id !== product.id);
  const sameCategory = product.category_id ? others.filter((p) => p.category_id === product.category_id) : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}
