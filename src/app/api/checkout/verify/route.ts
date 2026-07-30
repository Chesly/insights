import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fulfillOrder } from "@/lib/orders";

// GET /api/checkout/verify?reference=xxx — called by the success page
// right after Paystack redirects back. Never trust the redirect alone —
// always re-confirm the transaction status directly with Paystack's API
// before marking anything paid or handing over a download token.
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payments aren't configured on this site." }, { status: 500 });
  }

  const supabase = createServiceClient();
  const { data: order } = await supabase.from("orders").select("status").eq("paystack_reference", reference).single();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (order.status !== "paid") {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const paystackJson = await paystackRes.json();
    const success = paystackRes.ok && paystackJson.status && paystackJson.data?.status === "success";

    if (!success) {
      await supabase.from("orders").update({ status: "failed" }).eq("paystack_reference", reference);
      return NextResponse.json({ status: "failed" });
    }
  }

  const result = await fulfillOrder(reference);
  if (result.status === "not_found") {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json(result);
}
