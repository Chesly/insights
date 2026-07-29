import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { siteConfig } from "@/lib/siteConfig";

interface CheckoutItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
}

// POST — takes the cart + shopper email, records a 'pending' order, then
// asks Paystack to start a transaction and returns the hosted checkout
// URL. The browser is redirected there; Paystack redirects back to
// /checkout/success?reference=... once payment is attempted.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : [];
  const email = String(body.email || "").trim();
  const name = body.name ? String(body.name).trim() : null;

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments aren't configured on this site yet — missing PAYSTACK_SECRET_KEY." },
      { status: 500 }
    );
  }

  const amount = items.reduce((sum, i) => sum + Number(i.price || 0), 0);
  if (amount <= 0) {
    return NextResponse.json({ error: "Cart total must be greater than zero." }, { status: 400 });
  }

  const reference = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const supabase = createServiceClient();

  const { error: insertError } = await supabase.from("orders").insert({
    paystack_reference: reference,
    customer_email: email,
    customer_name: name,
    items,
    amount,
    status: "pending",
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  // Paystack takes amounts in kobo/cents — smallest currency unit, hence *100.
  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      currency: "ZAR",
      reference,
      callback_url: `${siteConfig.url}/checkout/success`,
      metadata: { items: items.map((i) => ({ productId: i.productId, name: i.name })) },
    }),
  });

  const paystackJson = await paystackRes.json();
  if (!paystackRes.ok || !paystackJson.status) {
    // Mark the order failed rather than leaving it stuck in 'pending' forever.
    await supabase.from("orders").update({ status: "failed" }).eq("paystack_reference", reference);
    return NextResponse.json(
      { error: paystackJson.message || "Could not start checkout — please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ authorizationUrl: paystackJson.data.authorization_url });
}
