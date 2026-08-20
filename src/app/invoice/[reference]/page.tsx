import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrderByReference, invoiceNumber } from "@/lib/invoice";
import { siteConfig } from "@/lib/siteConfig";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await getOrderByReference(reference);
  if (!order) notFound();

  const number = invoiceNumber(order);
  const date = new Date(order.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  const subtotal = order.items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="bg-white py-10 print:py-0 dark:bg-white">
      <div className="mx-auto max-w-2xl px-6 print:px-0">
        <div className="mb-6 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="border border-navy/10 p-8 print:border-0 print:p-0">
          <div className="flex items-start justify-between border-b border-navy/10 pb-6">
            <div>
              <img
                src={siteConfig.branding?.logoHeader || "https://ik.imagekit.io/mkvu8hdr5/insights/Chesly-Tech-Gol-Logo.png"}
                alt={siteConfig.shortName}
                className="h-8"
              />
              <p className="mt-3 text-xs text-navy/60">{siteConfig.owner.email}</p>
              <p className="text-xs text-navy/60">{siteConfig.url}</p>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-bold uppercase tracking-wide text-navy">
                {order.isFree ? "Receipt" : "Invoice"}
              </h1>
              <p className="mt-1 text-sm text-navy/70">{number}</p>
              <p className="text-xs text-navy/50">{date}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">Billed To</p>
              <p className="mt-1 font-medium text-navy">{order.customerName || "Customer"}</p>
              <p className="text-navy/70">{order.customerEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">Status</p>
              <p
                className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                  order.status === "paid"
                    ? "bg-green-50 text-green-700"
                    : order.status === "failed"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {order.status === "paid" ? (order.isFree ? "Delivered — Free" : "Paid") : order.status}
              </p>
            </div>
          </div>

          <table className="mt-8 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-xs font-semibold uppercase tracking-wide text-navy/50">
                <th className="pb-2">Item</th>
                <th className="pb-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-b border-navy/5">
                  <td className="py-3 text-navy">{item.name}</td>
                  <td className="py-3 text-right text-navy">R{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto mt-4 w-full max-w-[220px] space-y-1.5 text-sm">
            <div className="flex justify-between text-navy/70">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-navy/70">
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span>−R{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-navy/10 pt-1.5 text-base font-bold text-navy">
              <span>Total</span>
              <span>R{order.amount.toFixed(2)}</span>
            </div>
          </div>

          <p className="mt-8 text-xs text-navy/40">
            Reference: {order.paystackReference}
            {order.paidAt && ` · Paid ${new Date(order.paidAt).toLocaleDateString("en-ZA")}`}
          </p>
        </div>
      </div>
    </div>
  );
}
