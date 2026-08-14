import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// POST — the free-tier equivalent of /api/checkout. Creates a real order
// row (amount 0) with the same customer fields the paid flow collects,
// then hands off to the exact same fulfillOrder() the Paystack path
// uses for its zero-amount (coupon-covered) case — one shared place that
// mints the token, marks the order paid, and (see lib/orders.ts) sends
// the confirmation email. This means free claims land on the same
// /checkout/success confirmation page as paid ones instead of a silent
// new-tab download, and — since it's the same orders table — a future
// "issue an invoice" pass can treat paid and free orders identically
// instead of as two separate systems.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: downloadId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const whatsapp = body.whatsapp ? String(body.whatsapp).trim() : null;
  const country = body.country ? String(body.country).trim() : null;
  const stateProvince = body.stateProvince ? String(body.stateProvince).trim() : null;
  const notes = body.notes ? String(body.notes).trim() : null;
  const newsletterOptIn = Boolean(body.newsletterOptIn);

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: download } = await supabase
    .from("downloads")
    .select("id, slug, name, tier, is_published")
    .eq("id", downloadId)
    .single();
  if (!download || !download.is_published) {
    return NextResponse.json({ error: "This download isn't available." }, { status: 404 });
  }
  // Belt-and-braces: this route skips Paystack entirely, so it must never
  // be usable to claim a paid item by guessing its id.
  if (download.tier === "paid") {
    return NextResponse.json({ error: "This is a paid download — please use Buy Now." }, { status: 400 });
  }

  const reference = `free_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const { error: insertError } = await supabase.from("orders").insert({
    paystack_reference: reference,
    customer_email: email,
    customer_name: name,
    items: [{ productId: download.id, slug: download.slug, name: download.name, price: 0 }],
    amount: 0,
    status: "pending",
    whatsapp,
    country,
    state_province: stateProvince,
    notes,
    newsletter_opt_in: newsletterOptIn,
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  const { fulfillOrder } = await import("@/lib/orders");
  await fulfillOrder(reference, true);

  if (newsletterOptIn) {
    supabase
      .from("newsletter_subscribers")
      .upsert({ email, full_name: name, source: "free-download" }, { onConflict: "email" })
      .then(() => {});
  }

  return NextResponse.json({ reference });
}
