import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import PlaceholderImage from "@/components/lcdkhaya/PlaceholderImage";

export const metadata: Metadata = { title: { absolute: `About | ${lcdKhayaConfig.shortName}` } };

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="About LCD Khaya Driving School"
        subtitle={`Based in ${lcdKhayaConfig.contact.primaryArea}`}
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "About" }]}
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">{lcdKhayaConfig.tagline}</h2>
          {lcdKhayaConfig.aboutCopy.map((p) => (
            <p key={p} className="mt-4 text-[#1A1A1A]/70">{p}</p>
          ))}
          <p className="mt-4 text-[#1A1A1A]/70">
            We know the local test routes and yards in {lcdKhayaConfig.branches.map((b) => b.name).join(", ")} inside out —
            so your lessons prepare you for exactly what you'll face on test day.
          </p>
        </div>
        <PlaceholderImage variant="wheel" label="Photo coming soon" className="aspect-square w-full" />
      </div>

      <div className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Services</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="border border-[#B8860B]/25 p-6">
              <h3 className="font-semibold text-[#1A1A1A]">Learner's Licence</h3>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">
                Classes for all codes: Code 1 (Motorcycle), Code 2 (Light Vehicle) and Code 3 (Heavy &amp; Articulated Vehicle).
              </p>
            </div>
            <div className="border border-[#B8860B]/25 p-6">
              <h3 className="font-semibold text-[#1A1A1A]">Driving Licence</h3>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">
                Lessons for Motorcycle (A), Light Vehicle (Code 8 / B), Heavy Vehicle (Code 10 / C1) and Articulated
                Vehicle (Code 14 / EC) — plus vehicles supplied for your test.
              </p>
            </div>
            <div className="border border-[#B8860B]/25 p-6">
              <h3 className="font-semibold text-[#1A1A1A]">PrDP</h3>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">
                We assist with Professional Driving Permit applications for both Goods and Passengers categories.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-[#1A1A1A]/60">
            We handle online booking for our clients at their convenience, and assist with the necessary requirements
            along the way.
          </p>
        </div>
      </div>

      <div className="py-14">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Our Branches</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {lcdKhayaConfig.branches.map((branch) => (
              <div key={branch.name} className="border border-[#B8860B]/25 p-5">
                <h3 className="font-semibold text-[#1A1A1A]">{branch.name}</h3>
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

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]/50">Office Hours</h3>
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
