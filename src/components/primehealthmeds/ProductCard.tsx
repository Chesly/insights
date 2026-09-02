import Link from "next/link";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const outOfStock = product.track_stock && product.stock_quantity <= 0;

  return (
    <Link
      href={`/primehealthmeds/product/${product.slug}`}
      className="group block border border-[#0f766e]/10 bg-white p-4 transition hover:border-[#0f766e]/30 hover:shadow-sm"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#F7FAF9]">
        {product.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnail_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl" aria-hidden="true">💊</span>
        )}
      </div>
      <div className="mt-3">
        {product.requires_prescription && (
          <span className="mb-1 inline-block bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            Prescription
          </span>
        )}
        <p className="line-clamp-2 text-sm font-semibold text-[#111827] group-hover:text-[#0f766e]">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-bold text-[#0f766e]">R{Number(product.price).toFixed(2)}</span>
          {onSale && (
            <span className="text-xs text-[#111827]/40 line-through">R{Number(product.compare_at_price).toFixed(2)}</span>
          )}
        </div>
        {outOfStock && <p className="mt-1 text-xs font-semibold text-red-600">Out of stock</p>}
      </div>
    </Link>
  );
}
