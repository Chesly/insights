import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/primehealthmeds/catalog";
import PageHero from "@/components/primehealthmeds/PageHero";
import ProductCard from "@/components/primehealthmeds/ProductCard";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: { absolute: `${category.name} | ${cfg.shortName}` }, description: category.description };
}

export default async function PrimeHealthMedsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProductsByCategory(slug),
  ]);
  if (!category) notFound();

  return (
    <div>
      <PageHero
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "Shop", href: "/primehealthmeds/shop" }, { label: category.name }]}
      />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#111827]/50">Categories</h2>
          <ul className="mt-3 space-y-1.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/primehealthmeds/category/${c.slug}`}
                  className={`flex items-center gap-2 text-sm hover:text-[#0f766e] ${c.slug === slug ? "font-semibold text-[#0f766e]" : "text-[#111827]/70"}`}
                >
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          {products.length === 0 ? (
            <p className="text-sm text-[#111827]/50">No products in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
