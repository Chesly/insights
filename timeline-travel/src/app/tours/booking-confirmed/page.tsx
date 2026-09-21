import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingByReference } from "@/lib/bookings";
import { getAllSiteSettings } from "@/lib/settings";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = { title: "Booking Confirmed", robots: { index: false, follow: false } };

// This page is a cosmetic landing point after PayFast's redirect —
// display-only. The actual payment_status flip to "paid" already
// happened (or didn't) server-side via the PayFast ITN webhook before
// the customer ever lands here, so this page just reflects whatever the
// database already says rather than trusting anything in the URL.
export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const booking = ref ? await getBookingByReference(ref) : null;
  if (!booking) notFound();

  const settings = await getAllSiteSettings();
  const whatsappNumber = (settings.whatsapp_number || "").replace(/[^\d]/g, "");
  const isPaid = booking.paymentStatus === "paid";

  return (
    <div className="container-page py-16 print:py-4">
      <div className="mx-auto max-w-xl border border-black/10 p-8 print:border-0">
        <h1 className="text-2xl font-extrabold text-[#0F3D3E]">
          {isPaid ? "Booking Confirmed" : "Booking Received"}
        </h1>
        <p className="mt-2 text-sm text-[#0F3D3E]/60">
          {isPaid
            ? "Payment received — your booking is confirmed."
            : "We're still waiting on confirmation from PayFast. If you completed payment, this will update shortly; otherwise Timeline Travel will follow up with you."}
        </p>

        <dl className="mt-6 space-y-3 border-t border-black/5 pt-6 text-sm">
          <Row label="Booking Reference" value={booking.bookingReference} />
          <Row label="Tour" value={booking.tourTitle} />
          {booking.travelStartDate && <Row label="Travel Date" value={booking.travelStartDate} />}
          <Row label="Travellers" value={String(booking.travellersCount)} />
          <Row label="Amount" value={`${booking.currency} ${booking.amount.toLocaleString("en-ZA")}`} />
          <Row label="Name" value={booking.customerName} />
          <Row label="Email" value={booking.customerEmail} />
        </dl>

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <PrintButton label="Download / Print Confirmation" />
          <Link href="/contact" className="border border-[#0F3D3E]/20 px-4 py-2 text-sm font-semibold text-[#0F3D3E]">
            Contact Timeline Travel
          </Link>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to follow up on booking ${booking.bookingReference}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#0F3D3E]/20 px-4 py-2 text-sm font-semibold text-[#0F3D3E]"
            >
              WhatsApp Timeline Travel
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#0F3D3E]/50">{label}</dt>
      <dd className="text-right font-semibold text-[#0F3D3E]">{value}</dd>
    </div>
  );
}
