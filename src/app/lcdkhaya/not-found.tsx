import Link from "next/link";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// Without this, an unmatched /lcdkhaya/* URL falls through to the root
// app's not-found page — which is branded for Insights, not LCD Khaya.
export default function LcdKhayaNotFound() {
  return (
    <div className="container-page py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#B8860B]">404</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A1A1A]">Page Not Found</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[#1A1A1A]/60">
        We couldn't find that page. Try one of the links below, or head back home.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link href="/lcdkhaya" className="bg-[#B8860B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8B6E46]">
          Back to Home
        </Link>
        <Link href="/lcdkhaya/services" className="border border-[#1A1A1A]/20 px-6 py-3 text-sm font-semibold text-[#1A1A1A] hover:border-[#B8860B] hover:text-[#B8860B]">
          View Packages
        </Link>
        <Link href="/lcdkhaya/contact" className="border border-[#1A1A1A]/20 px-6 py-3 text-sm font-semibold text-[#1A1A1A] hover:border-[#B8860B] hover:text-[#B8860B]">
          Contact Us
        </Link>
      </div>
      <p className="mt-4 text-xs text-[#1A1A1A]/40">{lcdKhayaConfig.name}</p>
    </div>
  );
}
