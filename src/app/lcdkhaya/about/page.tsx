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
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Getting Daveyton &amp; Benoni Road-Ready</h2>
          <p className="mt-4 text-[#1A1A1A]/70">
            LCD Khaya Driving School was built around one goal: helping learners in Daveyton, Benoni and the
            surrounding East Rand pass their K53 test and become confident, safe drivers for life — not just
            for the day of the test.
          </p>
          <p className="mt-4 text-[#1A1A1A]/70">
            From your first lesson to your final road test, our instructors are patient, professional, and focused
            on building real skill and confidence behind the wheel, whether you're going for a learner's licence,
            a Code 8 driver's licence, or moving up to a Code 10 or Code 14.
          </p>
          <p className="mt-4 text-[#1A1A1A]/70">
            We know the local test routes and yards in {lcdKhayaConfig.branches.map((b) => b.name).join(", ")} inside out —
            so your lessons prepare you for exactly what you'll face on test day.
          </p>
        </div>
        <PlaceholderImage variant="wheel" label="Photo coming soon" className="aspect-square w-full" />
      </div>

      <div className="bg-white py-14">
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
        </div>
      </div>
    </div>
  );
}
