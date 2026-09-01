import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { slugify } from "@/lib/types";
import PageHero from "@/components/lcdkhaya/PageHero";
import PackageCard from "@/components/lcdkhaya/PackageCard";

// One page per branch for local SEO ("driving school in Daveyton", etc.)
// — generated from the same branch data everything else on the site
// already uses, so there's nothing branch-specific to maintain by hand.
export function generateStaticParams() {
  return lcdKhayaConfig.branches.map((b) => ({ branch: slugify(b.name) }));
}

function findBranch(slug: string) {
  return lcdKhayaConfig.branches.find((b) => slugify(b.name) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
  const { branch: slug } = await params;
  const branch = findBranch(slug);
  if (!branch) return {};
  return {
    title: { absolute: `Driving School in ${branch.name} | ${lcdKhayaConfig.shortName}` },
    description: `K53 driving lessons and licence training at LCD Khaya's ${branch.name} branch. Learner's licence, Code 8, Code 10, Code 14, motorcycle and PrDP.`,
    alternates: { canonical: `${lcdKhayaConfig.url}/areas/${slug}` }
  };
}

export default async function AreaPage({ params }: { params: Promise<{ branch: string }> }) {
  const { branch: slug } = await params;
  const branch = findBranch(slug);
  if (!branch) notFound();

  const otherBranches = lcdKhayaConfig.branches.filter((b) => b !== branch);

  return (
    <div>
      <PageHero
        title={`Driving School in ${branch.name}`}
        subtitle={`K53 driving lessons and licence training at our ${branch.name} branch.`}
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "About", href: "/lcdkhaya/about" }, { label: branch.name }]}
      />

      <div className="container-page grid gap-6 py-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">{branch.name} Branch</h2>
          {branch.addressLines.map((line) => (
            <p key={line} className="mt-1 text-sm text-[#1A1A1A]/70">{line}</p>
          ))}
          <p className="text-sm text-[#1A1A1A]/70">{branch.postalCode}</p>
          <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="mt-2 block text-sm font-semibold text-[#B8860B] hover:underline">
            {branch.phone}
          </a>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]/50">Office Hours</h3>
          <ul className="mt-2 space-y-1 text-sm text-[#1A1A1A]/70">
            {lcdKhayaConfig.officeHours.map((d) => (
              <li key={d.label}>{d.label}: {d.hours}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#1A1A1A]/50">{lcdKhayaConfig.lessonScheduleNote}</p>
        </div>

        <div>
          <p className="text-[#1A1A1A]/70">
            LCD Khaya has served {branch.name} and the surrounding Ekurhuleni area since {lcdKhayaConfig.foundedYear}.
            Whether you're after your learner's licence, a Code 8, 10 or 14 driving licence, a motorcycle licence, or a
            PrDP, our {branch.name} branch can get you there.
          </p>
          <Link
            href={`/lcdkhaya/booking`}
            className="mt-6 inline-block bg-[#B8860B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46]"
          >
            Book a Lesson
          </Link>
        </div>
      </div>

      <div className="bg-white py-6">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Packages Available at {branch.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lcdKhayaConfig.packages.slice(0, 3).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          <Link href="/lcdkhaya/services" className="mt-6 inline-block text-sm font-semibold text-[#B8860B] hover:underline">
            View all packages →
          </Link>
        </div>
      </div>

      {otherBranches.length > 0 && (
        <div className="container-page py-6">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Other Branches</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherBranches.map((b) => (
              <Link
                key={b.name}
                href={`/lcdkhaya/areas/${slugify(b.name)}`}
                className="border border-[#B8860B]/25 px-4 py-2 text-sm font-medium text-[#1A1A1A]/80 hover:border-[#B8860B] hover:text-[#B8860B]"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
