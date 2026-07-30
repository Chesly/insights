import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function computeDiscount(
  code: string,
  subtotal: number
): Promise<{ valid: true; discount: number; coupon: { code: string } } | { valid: false; error: string }> {
  const supabase = createServiceClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (!coupon || !coupon.active) return { valid: false, error: "That coupon code isn't valid." };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: "That coupon has expired." };
  }
  if (coupon.max_uses != null && coupon.use_count >= coupon.max_uses) {
    return { valid: false, error: "That coupon has already been fully redeemed." };
  }

  const discount =
    coupon.type === "percent" ? Math.round(subtotal * (coupon.value / 100) * 100) / 100 : Math.min(coupon.value, subtotal);

  return { valid: true, discount, coupon: { code: coupon.code } };
}

// POST — used by the cart page to preview a discount before checkout.
// The real checkout route re-runs this same check server-side rather
// than trusting whatever discount the browser sends back.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.code || typeof body.subtotal !== "number") {
    return NextResponse.json({ valid: false, error: "Missing code or subtotal." }, { status: 400 });
  }
  const result = await computeDiscount(body.code, body.subtotal);
  return NextResponse.json(result);
}
