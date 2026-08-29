import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: { absolute: `Contact | ${lcdKhayaConfig.shortName}` } };

export default function ContactPage() {
  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="Questions about lessons, pricing or booking? Get in touch."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Get In Touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#1A1A1A]/70">
            <li>
              <strong className="text-[#1A1A1A]">Phone:</strong>{" "}
              <a href={`tel:${lcdKhayaConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-[#B8860B]">
                {lcdKhayaConfig.contact.phone}
              </a>
            </li>
            <li>
              <strong className="text-[#1A1A1A]">Email:</strong>{" "}
              <a href={`mailto:${lcdKhayaConfig.contact.email}`} className="hover:text-[#B8860B]">
                {lcdKhayaConfig.contact.email}
              </a>
            </li>
            <li><strong className="text-[#1A1A1A]">Hours:</strong> {lcdKhayaConfig.contact.hours}</li>
            <li><strong className="text-[#1A1A1A]">Branches:</strong> {lcdKhayaConfig.branches.map((b) => b.name).join(", ")}</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
