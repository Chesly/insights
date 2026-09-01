import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { slugify } from "@/lib/types";
import PageHero from "@/components/lcdkhaya/PageHero";
import ThreeColumnSection from "@/components/lcdkhaya/ThreeColumnSection";

export const metadata: Metadata = { title: { absolute: `About | ${lcdKhayaConfig.shortName}` } };

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="About LCD Khaya Driving School"
        subtitle={`Based in ${lcdKhayaConfig.contact.primaryArea}`}
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "About" }]}
      />
      <div className="container-page grid gap-6 py-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">{lcdKhayaConfig.tagline}</h2>
          {lcdKhayaConfig.aboutCopy.map((p) => (
            <p key={p} className="mt-3 text-sm text-[#1A1A1A]/70">{p}</p>
          ))}
          <p className="mt-3 text-sm text-[#1A1A1A]/70">
            We know the local test routes and yards in {lcdKhayaConfig.branches.map((b) => b.name).join(", ")} inside out —
            so your lessons prepare you for exactly what you'll face on test day.
          </p>
        </div>
        <div className="relative aspect-square w-full">
          <Image
            src={lcdKhayaConfig.aboutImage}
            alt={`${lcdKhayaConfig.name} instructor and learner`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="bg-white py-6">
        <div className="container-page">
          <span className="eyebrow block text-xs font-semibold uppercase tracking-[0.15em] text-[#B8860B]">What We Offer</span>
          <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">Our Services</h2>
          <div className="mt-4">
            <ThreeColumnSection items={lcdKhayaConfig.threeColumn} ctaHref="/lcdkhaya/services" />
          </div>
          <p className="mt-4 text-sm text-[#1A1A1A]/60">
            We handle online booking for our clients at their convenience, and assist with the necessary requirements
            along the way.
          </p>
        </div>
      </div>

      <div className="py-6">
        <div className="container-page">
          <span className="eyebrow block text-xs font-semibold uppercase tracking-[0.15em] text-[#B8860B]">Locations</span>
          <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">Our Branches</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {lcdKhayaConfig.branches.map((branch) => (
              <div key={branch.name} className="border border-[#B8860B]/25 p-4">
                <Link href={`/lcdkhaya/areas/${slugify(branch.name)}`} className="font-semibold text-[#1A1A1A] hover:text-[#B8860B]">
                  {branch.name}
                </Link>
                {branch.addressLines.map((line) => (
                  <p key={line} className="mt-1 text-sm text-[#1A1A1A]/60">{line}</p>
                ))}
                <p className="text-sm text-[#1A1A1A]/60">{branch.postalCode}</p>
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="mt-2 block text-sm font-medium text-[#B8860B] hover:underline">
                  {branch.phone}
                </a>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]/50">Office Hours</h3>
          <ul className="mt-2 space-y-1 text-sm text-[#1A1A1A]/70">
            {lcdKhayaConfig.officeHours.map((d) => (
              <li key={d.label}>{d.label}: {d.hours}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#1A1A1A]/50">{lcdKhayaConfig.lessonScheduleNote}</p>
        </div>
      </div>
    </div>
  );
}
