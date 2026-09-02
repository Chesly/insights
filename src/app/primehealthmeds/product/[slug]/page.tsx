import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { getProductBySlug, getRelatedProducts } from "@/lib/primehealthmeds/catalog";
import PageHero from "@/components/primehealthmeds/PageHero";
import ProductCard from "@/components/primehealthmeds/ProductCard";
import AddToCartButton from "@/components/primehealthmeds/AddToCartButton";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: { absolute: `${product.seo_title || product.name} | ${cfg.shortName}` },
    description: product.meta_description || product.short_description,
  };
}

export default async function PrimeHealthMedsProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;

  return (
    <div>
      <PageHero
        title={product.name}
        breadcrumbs={[
          { label: "Home", href: "/primehealthmeds" },
          { label: "Shop", href: "/primehealthmeds/shop" },
          ...(product.category ? [{ label: product.category.name, href: `/primehealthmeds/category/${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center bg-[#F7FAF9]">
          {product.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.thumbnail_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl" aria-hidden="true">💊</span>
          )}
        </div>
        <div>
          {product.requires_prescription && (
            <span className="mb-2 inline-block bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Requires Prescription
            </span>
          )}
          <h1 className="text-2xl font-bold text-[#111827]">{product.name}</h1>
          {product.short_description && <p className="mt-2 text-[#111827]/60">{product.short_description}</p>}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-[#0f766e]">R{Number(product.price).toFixed(2)}</span>
            {onSale && <span className="text-[#111827]/40 line-through">R{Number(product.compare_at_price).toFixed(2)}</span>}
          </div>
          <div className="mt-6 max-w-sm">
            <AddToCartButton product={product} />
          </div>
          {product.description && (
            <div className="mt-8 border-t border-[#0f766e]/10 pt-6 text-sm text-[#111827]/70">
              <h2 className="mb-2 font-semibold text-[#111827]">Description</h2>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}
          {product.sku && <p className="mt-4 text-xs text-[#111827]/40">SKU: {product.sku}</p>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-14">
          <h2 className="text-lg font-bold text-[#111827]">You Might Also Need</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
