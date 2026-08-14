"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import type { DownloadItem } from "@/lib/downloads";

// Compact CTA for product-card grids (ProductsTeaser, shop grid) — mirrors
// DownloadButton's paid-tier cart logic but skips its modal-driven free/
// premium claim flow, since a teaser card just needs to route shoppers to
// the right place rather than collect a lead inline.
export default function AddToCartButton({ item, className = "" }: { item: DownloadItem; className?: string }) {
  const { addItem, isInCart } = useCart();

  const baseClass =
    "block w-full border border-gold bg-gold px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gold-dark";

  if (item.tier === "paid" && !item.storeUrl && item.price != null) {
    const inCart = isInCart(item.id);
    return (
      <Link
        href="/cart"
        onClick={(e) => {
          if (inCart) return;
          e.preventDefault();
          addItem({ productId: item.id, slug: item.slug, name: item.name, price: item.price!, thumbnailUrl: item.thumbnailUrl });
          window.location.href = "/cart";
        }}
        className={`${baseClass} ${className}`}
      >
        🛒 {inCart ? "View Cart" : "Add to Cart"}
      </Link>
    );
  }

  return (
    <Link href={`/tools/${item.slug}`} className={`${baseClass} ${className}`}>
      {item.tier === "free" ? "Get for Free" : "View Details"}
    </Link>
  );
}
