import type { Metadata } from "next";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import PageHero from "@/components/primehealthmeds/PageHero";

export const metadata: Metadata = { title: { absolute: `Contact | ${cfg.shortName}` } };

export default function PrimeHealthMedsContactPage() {
  return (
    <div>
      <PageHero title="Contact Us" breadcrumbs={[{ label: "Home", href: "/primehealthmeds" }, { label: "Contact" }]} />
      <div className="container-page max-w-md py-10 text-sm text-[#111827]/70">
        <p>
          Email:{" "}
          <a href={`mailto:${cfg.contact.email}`} className="font-semibold text-[#0f766e] hover:underline">{cfg.contact.email}</a>
        </p>
        {cfg.contact.phone && !cfg.contact.phone.startsWith("PLACEHOLDER") && <p className="mt-2">Phone: {cfg.contact.phone}</p>}
        {cfg.contact.address && !cfg.contact.address.startsWith("PLACEHOLDER") && <p className="mt-2">{cfg.contact.address}</p>}
      </div>
    </div>
  );
}
