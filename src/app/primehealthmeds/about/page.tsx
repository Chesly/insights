import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import PageHero from "@/components/primehealthmeds/PageHero";

export const metadata: Metadata = { title: { absolute: `About | ${cfg.shortName}` } };

export default function PrimeHealthMedsAboutPage() {
  return (
    <div>
      <PageHero title="About Us" breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "About" }]} />
      <div className="container-page max-w-2xl py-10 text-sm leading-relaxed text-[#111827]/70">
        <p>{cfg.footer.about}</p>
      </div>
    </div>
  );
}
