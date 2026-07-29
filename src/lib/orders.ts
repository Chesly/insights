import { createServiceClient } from "./supabase/service";
import { createDownloadToken, PAID_TOKEN_CONFIG } from "./downloadTokens";

interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
}

/**
 * Marks an order paid and generates a secure download token per item —
 * called from BOTH the checkout redirect verify route AND the Paystack
 * webhook, since either one might fire first (or only one might, if the
 * customer closes the tab before the redirect completes). Idempotent:
 * if the order is already 'paid', this does nothing new — it looks up
 * the tokens already issued, rather than minting duplicates.
 */
export async function fulfillOrder(
  paystackReference: string
): Promise<
  | { status: "paid"; downloads: { name: string; slug: string; downloadUrl: string }[] }
  | { status: "not_found" }
> {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("paystack_reference", paystackReference)
    .single();
  if (!order) return { status: "not_found" };

  const items: OrderItem[] = order.items || [];

  if (order.status === "paid") {
    const { data: tokens } = await supabase
      .from("download_tokens")
      .select("token, download_id")
      .eq("order_id", order.id);

    const downloads = (tokens || []).map((t) => {
      const item = items.find((i) => i.productId === t.download_id);
      return {
        name: item?.name || "Your download",
        slug: item?.slug || "",
        downloadUrl: `/api/download/${t.token}`,
      };
    });
    return { status: "paid", downloads };
  }

  // First time this order is being fulfilled — increment the coupon's
  // use count here (not at validation time), so abandoned or failed
  // checkouts never burn a coupon's limited uses.
  if (order.coupon_code) {
    const { data: coupon } = await supabase.from("coupons").select("*").eq("code", order.coupon_code).single();
    if (coupon) {
      await supabase.from("coupons").update({ use_count: coupon.use_count + 1 }).eq("id", coupon.id);
    }
  }

  await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id);

  const downloads = await Promise.all(
    items.map(async (item) => {
      const token = await createDownloadToken({
        downloadId: item.productId,
        email: order.customer_email,
        orderId: order.id,
        ...PAID_TOKEN_CONFIG,
      });
      return { name: item.name, slug: item.slug, downloadUrl: `/api/download/${token}` };
    })
  );

  return { status: "paid", downloads };
}
