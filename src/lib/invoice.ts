import { createServiceClient } from "./supabase/service";

export interface InvoiceOrder {
  id: string;
  paystackReference: string;
  customerEmail: string;
  customerName: string | null;
  items: { productId: string; slug: string; name: string; price: number }[];
  amount: number;
  discountAmount: number;
  couponCode: string | null;
  status: "pending" | "paid" | "failed";
  createdAt: string;
  paidAt: string | null;
  isFree: boolean;
}

/** A human-readable, sequential-looking invoice number derived entirely
    from data the order row already has — no new column, no migration, and
    every past order gets a working number retroactively instead of only
    ones created after a schema change. Date prefix keeps them sortable at
    a glance; the id fragment keeps them unique. */
export function invoiceNumber(order: Pick<InvoiceOrder, "id" | "createdAt">): string {
  const d = new Date(order.createdAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  return `INV-${datePart}-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export async function getOrderByReference(reference: string): Promise<InvoiceOrder | null> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("orders").select("*").eq("paystack_reference", reference).single();
  if (!data) return null;
  return {
    id: data.id,
    paystackReference: data.paystack_reference,
    customerEmail: data.customer_email,
    customerName: data.customer_name,
    items: data.items || [],
    amount: Number(data.amount),
    discountAmount: Number(data.discount_amount || 0),
    couponCode: data.coupon_code,
    status: data.status,
    createdAt: data.created_at,
    paidAt: data.paid_at,
    isFree: data.paystack_reference?.startsWith("free_") || Number(data.amount) === 0,
  };
}
