import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import PackageCard from "@/components/lcdkhaya/PackageCard";

export const metadata: Metadata = { title: { absolute: `Services & Packages | ${lcdKhayaConfig.shortName}` } };

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        title="Services & Packages"
        subtitle="From your learner's licence to a professional driving permit — find the package that fits."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Services & Packages" }]}
      />
      <div className="container-page py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lcdKhayaConfig.packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#1A1A1A]/50">{lcdKhayaConfig.depositNote}</p>
      </div>
    </div>
  );
}
