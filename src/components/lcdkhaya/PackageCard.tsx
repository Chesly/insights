import Link from "next/link";
import { Check } from "lucide-react";
import type { DrivingPackage } from "@/lib/lcdkhaya/config";

export default function PackageCard({ pkg }: { pkg: DrivingPackage }) {
  return (
    <div
      id={pkg.id}
      className="group flex scroll-mt-20 flex-col border border-[#B8860B]/20 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-[#B8860B]/10 lg:scroll-mt-36"
    >
      <span className="w-fit bg-[#8B6E46]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#8B6E46]">
        {pkg.code}{pkg.licenceCode ? ` · Licence Code ${pkg.licenceCode}` : ""}
      </span>
      <h3 className="mt-3 text-lg font-bold text-[#1A1A1A]">{pkg.name}</h3>
      <p className="mt-2 text-sm text-[#1A1A1A]/70">{pkg.description}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[#1A1A1A]/70">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-[#B8860B]/15 pt-4">
        <span className="text-sm font-semibold text-[#1A1A1A]">
          {pkg.price != null ? `R${pkg.price.toLocaleString("en-ZA")}${pkg.priceUnit ? ` ${pkg.priceUnit}` : ""}` : "Contact for pricing"}
        </span>
        <Link
          href={`/lcdkhaya/booking?package=${pkg.id}`}
          className="bg-[#B8860B] px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#8B6E46]"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
