import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/orders";
import { fulfillBooking } from "@/lib/lcdkhaya/bookings";

// POST — Paystack calls this server-to-server the moment a payment
// succeeds, independent of whether the customer's browser ever makes it
// back to /checkout/success (closed tab, network drop, etc). This is
// what makes the store reliable rather than "usually works": the
// redirect-based verify is the fast path for a good UX, this webhook is
// the safety net that guarantees a paid order never gets stuck as
// 'pending' just because a browser round-trip didn't complete.
//
// Register this URL in Paystack Dashboard → Settings → API Keys & Webhooks:
//   https://insights.chesly.tech/api/webhooks/paystack
export async function POST(req: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const rawBody = await req.text();

  // Verify this request genuinely came from Paystack — without this,
  // anyone could POST a fake "payment succeeded" event to this URL.
  const signature = req.headers.get("x-paystack-signature");
  const expectedSignature = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    // LCD Khaya bookings live in their own table with their own
    // fulfillment (confirmation email, not download tokens) — see
    // lib/lcdkhaya/bookings.ts — so route by the reference prefix set
    // when the transaction was initialized.
    if (reference?.startsWith("lcdkhaya_")) await fulfillBooking(reference);
    else if (reference) await fulfillOrder(reference);
  }

  // Paystack just needs a 200 to know the webhook was received — it
  // retries automatically if it doesn't get one.
  return NextResponse.json({ received: true });
}
