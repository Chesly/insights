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
            We know the local test routes and yards in {lcdKhayaConfig.contact.serviceAreas.join(", ")} inside out —
            so your lessons prepare you for exactly what you'll face on test day.
          </p>
        </div>
        <PlaceholderImage variant="wheel" label="Photo coming soon" className="aspect-square w-full" />
      </div>

      <div className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Areas We Serve</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {lcdKhayaConfig.contact.serviceAreas.map((area) => (
              <span key={area} className="border border-[#B8860B]/25 px-4 py-2 text-sm font-medium text-[#1A1A1A]/80">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
