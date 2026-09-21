import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Booking Cancelled", robots: { index: false, follow: false } };

export default function BookingCancelledPage() {
  return (
    <div className="container-page py-16 text-center">
      <h1 className="text-2xl font-extrabold text-[#0F3D3E]">Payment Cancelled</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#0F3D3E]/60">
        Your payment was cancelled and no money was taken. Your booking is still saved as pending — you can try
        again from the tour page, or contact us for help.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/tours" className="bg-[#D9A62E] px-5 py-3 text-sm font-bold text-[#0F3D3E]">
          Back to Tours
        </Link>
        <Link href="/contact" className="border border-[#0F3D3E]/20 px-5 py-3 text-sm font-semibold text-[#0F3D3E]">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
