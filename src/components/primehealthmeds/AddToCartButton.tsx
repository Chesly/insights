"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/types";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.track_stock && product.stock_quantity <= 0;

  if (outOfStock) {
    return (
      <button type="button" disabled className="w-full cursor-not-allowed bg-[#111827]/10 px-4 py-3 text-sm font-semibold text-[#111827]/40">
        Out of Stock
      </button>
    );
  }

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      thumbnailUrl: product.thumbnail_url,
      price: Number(product.price),
      type: "physical",
      site: cfg.catalogSite,
      quantity: 1,
    });
    setAdded(true);
  };

  if (added || isInCart(product.id)) {
    return (
      <Link href="/cart" className="block w-full bg-[#0f766e] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#0d5f59]">
        In Cart — View Cart →
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleAdd} className="w-full bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d5f59]">
      Add to Cart
    </button>
  );
}
