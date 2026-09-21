import Link from "next/link";
import Image from "next/image";
import { getAllSiteSettings } from "@/lib/settings";
import { getAllServices } from "@/lib/services";
import { getFeaturedDestinations } from "@/lib/destinations";
import { siteConfig } from "@/lib/site";

export default async function Footer() {
  const [settings, services, destinations] = await Promise.all([
    getAllSiteSettings(),
    getAllServices(),
    getFeaturedDestinations(),
  ]);

  const phone = settings.contact_phone || "+27 71 475 9998";
  const email = settings.contact_email || "andrew@timelinetravel.co.za";
  const address = settings.contact_address || siteConfig.address;

  return (
    <footer className="bg-[#0F3D3E] text-white/80">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.name}
            width={160}
            height={48}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-sm text-sm text-white/60">{siteConfig.shortDescription}</p>
        </div>

        <FooterColumn
          title="Quick Links"
          items={siteConfig.nav.map((n) => ({ label: n.label, href: n.href }))}
        />

        <FooterColumn
          title="Our Services"
          items={services.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` }))}
        />

        <FooterColumn
          title="Popular Destinations"
          items={destinations.slice(0, 5).map((d) => ({ label: d.title, href: `/destinations/${d.slug}` }))}
        />

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <address className="mt-4 space-y-2 text-sm not-italic text-white/60">
            <p>{address}</p>
            <p><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#D9A62E]">{phone}</a></p>
            <p><a href={`mailto:${email}`} className="hover:text-[#D9A62E]">{email}</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Timeline Travel. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link>
            <a href="https://chesly.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Website by Chesly.Tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-white/60 hover:text-[#D9A62E]">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
