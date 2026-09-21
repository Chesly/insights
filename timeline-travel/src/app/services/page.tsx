import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase, Users, Sun, Plane, Calendar, BadgeCheck, Car, ShieldCheck, MapPinned,
} from "lucide-react";
import { getAllServices } from "@/lib/services";

const ICONS: Record<string, typeof Briefcase> = {
  "corporate-travel": Briefcase,
  "group-travel": Users,
  "leisure-travel": Sun,
  "flights-accommodation": Plane,
  "mice-events": Calendar,
  "visa-assistance": BadgeCheck,
  "airport-transfers": Car,
  "travel-insurance": ShieldCheck,
  "destination-management": MapPinned,
};

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">What We Offer</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Our Services</h1>
      <p className="mt-3 max-w-xl text-sm text-[#0F3D3E]/60">Everything you need for a seamless journey.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = ICONS[s.slug] || Briefcase;
          return (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="group flex flex-col gap-3 border border-black/5 p-6 transition-shadow hover:shadow-md"
            >
              <Icon className="h-7 w-7 text-[#D9A62E]" />
              <h2 className="font-bold text-[#0F3D3E] group-hover:text-[#D9A62E]">{s.title}</h2>
              {s.description && <p className="text-sm text-[#0F3D3E]/60">{s.description}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
