import Link from "next/link";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getCategories, getAllProducts } from "@/lib/primehealthmeds/catalog";
import ProductCard from "@/components/primehealthmeds/ProductCard";

export const revalidate = 3600;

export default async function PrimeHealthMedsHomePage() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  const featured = products.slice(0, 8);

  return (
    <div>
      <div className="bg-gradient-to-r from-[#0d5f59] to-[#0f766e] py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{cfg.tagline}</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{cfg.description}</p>
          <Link href="/primehealthmeds/shop" className="mt-6 inline-block bg-white px-6 py-3 text-sm font-semibold text-[#0f766e] hover:bg-white/90">
            Shop All Products →
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-xl font-bold text-[#111827]">Shop by Category</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/primehealthmeds/category/${c.slug}`}
                className="flex flex-col items-center gap-2 border border-[#0f766e]/10 bg-white p-5 text-center hover:border-[#0f766e]/30"
              >
                <span className="text-3xl" aria-hidden="true">{c.icon}</span>
                <span className="text-sm font-semibold text-[#111827]">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-12">
        <h2 className="text-xl font-bold text-[#111827]">Featured Products</h2>
        {featured.length === 0 ? (
          <p className="mt-4 text-sm text-[#111827]/50">
            No products published yet — add products in the Insights admin (Catalog: Prime Health Meds).
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
