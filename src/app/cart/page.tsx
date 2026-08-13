
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import PageHero from "@/components/PageHero";

export default function CartPage() {
  const { items, removeItem, total, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponStatus, setCouponStatus] = useState<"idle" | "checking" | "error">("idle");
  const [couponError, setCouponError] = useState("");

  const finalTotal = Math.max(0, total - (coupon?.discount || 0));
  const isFree = finalTotal <= 0;

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponStatus("checking");
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal: total }),
      });
      const json = await res.json();
      if (!json.valid) throw new Error(json.error || "That coupon isn't valid.");
      setCoupon({ code: json.coupon.code, discount: json.discount });
      setCouponStatus("idle");
    } catch (err) {
      setCoupon(null);
      setCouponStatus("error");
      setCouponError(err instanceof Error ? err.message : "That coupon isn't valid.");
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email, name, couponCode: coupon?.code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong — please try again.");
      // Cart is cleared once we know the order was accepted — if the
      // shopper abandons checkout, their items simply aren't lost, since
      // nothing here clears the cart until this point is reached.
      clearCart();
      window.location.href = json.authorizationUrl;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  }

  return (
    <div>
      <PageHero
        title="Your Cart"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        heightPx={140}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          {items.length === 0 ? (
            <div className="border border-gold/15 p-10 text-center">
              <p className="text-navy/60 dark:text-white/60">Your cart is empty.</p>
              <Link href="/downloads" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">
                Browse the Business Toolkit →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-navy/10 border border-navy/10 dark:divide-white/10 dark:border-white/10">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden bg-gold/5">
                    {item.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">📄</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy dark:text-white">{item.name}</p>
                    <p className="text-sm text-gold">R{item.price.toLocaleString("en-ZA")}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs font-semibold uppercase tracking-wide text-navy/40 hover:text-red-600 dark:text-white/40"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <aside className="h-fit border border-gold/15 p-6">
            <div className="space-y-1 border-b border-navy/10 pb-4 dark:border-white/10">
              <div className="flex items-center justify-between text-sm text-navy/60 dark:text-white/60">
                <span>Subtotal</span>
                <span>R{total.toLocaleString("en-ZA")}</span>
              </div>
              {coupon && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Coupon ({coupon.code})</span>
                  <span>–R{coupon.discount.toLocaleString("en-ZA")}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-navy dark:text-white">Total</span>
                <span className="text-xl font-bold text-gold">{isFree ? "Free" : `R${finalTotal.toLocaleString("en-ZA")}`}</span>
              </div>
            </div>

            <form onSubmit={applyCoupon} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="min-w-0 flex-1 border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={couponStatus === "checking" || !couponInput.trim()}
                className="shrink-0 border border-navy px-3 py-2 text-xs font-semibold uppercase text-navy hover:bg-navy hover:text-white disabled:opacity-50 dark:border-white dark:text-white"
              >
                Apply
              </button>
            </form>
            {couponStatus === "error" && <p className="mt-1 text-xs text-red-600">{couponError}</p>}

            <form onSubmit={handleCheckout} className="mt-4 space-y-3">
              <div>
                <label htmlFor="cart-name" className="mb-1 block text-xs font-semibold text-navy/70 dark:text-white/70">
                  Full Name
                </label>
                <input
                  id="cart-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="cart-email" className="mb-1 block text-xs font-semibold text-navy/70 dark:text-white/70">
                  Email — your download link goes here
                </label>
                <input
                  id="cart-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-gold px-4 py-3 text-sm font-semibold text-white hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting"
                  ? isFree ? "Processing…" : "Redirecting to Paystack…"
                  : isFree ? "Get for Free" : "Checkout with Paystack"}
              </button>
              <p className="text-center text-[11px] text-navy/40 dark:text-white/40">
                {isFree
                  ? "🎉 Covered in full — no payment needed. Your download link will be ready on the next screen."
                  : "🔒 Secure payment via Paystack. You'll be redirected to complete payment."}
              </p>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}
