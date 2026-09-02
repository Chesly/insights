import Link from "next/link";
import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getCategories, getAllProducts } from "@/lib/primehealthmeds/catalog";
import PageHero from "@/components/primehealthmeds/PageHero";
import ProductCard from "@/components/primehealthmeds/ProductCard";

export const metadata: Metadata = { title: { absolute: `Shop | ${cfg.shortName}` } };
export const revalidate = 3600;

export default async function PrimeHealthMedsShopPage() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  return (
    <div>
      <PageHero title="Shop All Products" breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "Shop" }]} />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#111827]/50">Categories</h2>
          <ul className="mt-3 space-y-1.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/primehealthmeds/category/${c.slug}`} className="flex items-center gap-2 text-sm text-[#111827]/70 hover:text-[#0f766e]">
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          {products.length === 0 ? (
            <p className="text-sm text-[#111827]/50">
              No products published yet — add products in the Insights admin (Catalog: Prime Health Meds).
            </p>
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
