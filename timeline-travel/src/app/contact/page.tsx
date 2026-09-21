import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getAllSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Contact", description: `Get in touch with ${siteConfig.name}.` };
}

export default async function ContactPage() {
  const settings = await getAllSiteSettings();
  const phone = settings.contact_phone || "+27 71 475 9998";
  const email = settings.contact_email || "andrew@timelinetravel.co.za";
  const address = settings.contact_address || siteConfig.address;
  const whatsappNumber = (settings.whatsapp_number || "").replace(/[^\d]/g, "");

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">Talk to Timeline Travel</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Contact</h1>
      <p className="mt-3 max-w-xl text-sm text-[#0F3D3E]/60">
        Have a question about a tour, a corporate account, or need help planning something specific? Send us a
        message, or reach us directly below.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <ContactForm />

        <aside className="space-y-4">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-start gap-3 border border-black/5 p-5">
            <Phone className="mt-0.5 h-5 w-5 text-[#D9A62E]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3D3E]/50">Phone</p>
              <p className="font-semibold text-[#0F3D3E]">{phone}</p>
            </div>
          </a>
          <a href={`mailto:${email}`} className="flex items-start gap-3 border border-black/5 p-5">
            <Mail className="mt-0.5 h-5 w-5 text-[#D9A62E]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3D3E]/50">Email</p>
              <p className="font-semibold text-[#0F3D3E]">{email}</p>
            </div>
          </a>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 border border-black/5 p-5"
            >
              <MessageCircle className="mt-0.5 h-5 w-5 text-[#D9A62E]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3D3E]/50">WhatsApp</p>
                <p className="font-semibold text-[#0F3D3E]">Chat on WhatsApp</p>
              </div>
            </a>
          )}
          <div className="flex items-start gap-3 border border-black/5 p-5">
            <MapPin className="mt-0.5 h-5 w-5 text-[#D9A62E]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3D3E]/50">Address</p>
              <p className="font-semibold text-[#0F3D3E]">{address}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
