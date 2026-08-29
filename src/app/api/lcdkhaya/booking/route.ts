import { NextRequest, NextResponse } from "next/server";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { createBooking, recordLeadBooking } from "@/lib/lcdkhaya/bookings";

// POST — books a driving-lesson package. Same shape as /api/checkout for
// Insights digital products, but simpler (one package per booking, no
// cart/coupons) and it writes to lcdkhaya_bookings instead of orders —
// see lib/lcdkhaya/bookings.ts for why that's a separate table.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const packageId = String(body.packageId || "").trim();
  const packageName = String(body.packageName || "").trim();
  const customerName = String(body.customerName || "").trim();
  const customerEmail = String(body.customerEmail || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();
  const preferredArea = body.preferredArea ? String(body.preferredArea).trim() : "";
  const preferredDate = body.preferredDate ? String(body.preferredDate).trim() : null;
  const notes = body.notes ? String(body.notes).trim() : null;
  const newsletterOptIn = Boolean(body.newsletterOptIn);
  const packagePrice = Number(body.packagePrice) || 0;

  if (!packageId || !packageName || !customerName || !customerPhone) {
    return NextResponse.json({ error: "Package, name and phone number are required." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(customerEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const { reference } = await createBooking({
    packageId,
    packageName,
    packagePrice,
    customerName,
    customerEmail,
    customerPhone,
    preferredArea,
    preferredDate,
    notes,
    newsletterOptIn
  });

  // Pricing for this package is still TBD — record it as a lead for LCD
  // Khaya to quote and confirm manually rather than trying to charge R0
  // through Paystack.
  if (packagePrice <= 0) {
    await recordLeadBooking(reference);
    return NextResponse.json({ authorizationUrl: `/lcdkhaya/booking/success?reference=${reference}&lead=1` });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments aren't configured on this site yet — missing PAYSTACK_SECRET_KEY." },
      { status: 500 }
    );
  }

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: customerEmail,
      amount: Math.round(packagePrice * 100),
      currency: "ZAR",
      reference,
      callback_url: `${lcdKhayaConfig.url}/booking/success`,
      metadata: { packageId, packageName }
    })
  });

  const paystackJson = await paystackRes.json();
  if (!paystackRes.ok || !paystackJson.status) {
    return NextResponse.json(
      { error: paystackJson.message || "Could not start checkout — please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ authorizationUrl: paystackJson.data.authorization_url });
}
