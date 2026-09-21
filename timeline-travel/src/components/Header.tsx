import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Search } from "lucide-react";
import { getAllSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import MobileNav from "./MobileNav";

const SOCIAL_ICONS: Record<string, { label: string; path: string }> = {
  social_facebook: {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
  },
  social_instagram: {
    label: "Instagram",
    path: "M12 2c-2.7 0-3.1 0-4.1.1-1.1 .1-1.8.2-2.5.5-.7.3-1.3.6-1.9 1.2-.6.6-.9 1.2-1.2 1.9-.3.7-.5 1.4-.5 2.5C1.7 9.2 1.7 9.6 1.7 12s0 2.8.1 3.8c.1 1.1.2 1.8.5 2.5.3.7.6 1.3 1.2 1.9.6.6 1.2.9 1.9 1.2.7.3 1.4.5 2.5.5C9 22 9.3 22 12 22s2.8 0 3.8-.1c1.1-.1 1.8-.2 2.5-.5.7-.3 1.3-.6 1.9-1.2.6-.6.9-1.2 1.2-1.9.3-.7.5-1.4.5-2.5.1-1 .1-1.4.1-3.8s0-2.8-.1-3.8c-.1-1.1-.2-1.8-.5-2.5-.3-.7-.6-1.3-1.2-1.9-.6-.6-1.2-.9-1.9-1.2-.7-.3-1.4-.5-2.5-.5C14.8 2 14.4 2 12 2zm0 1.8c2.6 0 2.9 0 4 .1.9.1 1.5.2 1.8.4.5.2.8.4 1.1.7.3.3.6.6.7 1.1.2.3.3.9.4 1.8.1 1 .1 1.4.1 4s0 2.9-.1 4c-.1.9-.2 1.5-.4 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.2-.9.3-1.8.4-1 .1-1.4.1-4 .1s-2.9 0-4-.1c-.9-.1-1.5-.2-1.8-.4-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.2-.3-.3-.9-.4-1.8-.1-1-.1-1.4-.1-4s0-2.9.1-4c.1-.9.2-1.5.4-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.2.9-.3 1.8-.4 1-.1 1.4-.1 4-.1zm0 3.2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z",
  },
  social_x: {
    label: "X",
    path: "M18.9 2.6h3.2l-7 8 8.2 10.8h-6.4l-5-6.6-5.8 6.6H2l7.5-8.6-7.9-10.2h6.5l4.5 6 5.3-6zm-1.1 17h1.7L7.3 4.3H5.5L17.8 19.6z",
  },
};

export default async function Header() {
  const settings = await getAllSiteSettings();
  const phone = settings.contact_phone || "+27 71 475 9998";
  const email = settings.contact_email || "andrew@timelinetravel.co.za";
  const socials = Object.entries(SOCIAL_ICONS)
    .map(([key, icon]) => ({ ...icon, url: settings[key] }))
    .filter((s) => s.url);

  return (
    <header className="sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-[#0F3D3E] text-white">
        <div className="container-page flex items-center justify-between py-2 text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-[#D9A62E]">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-[#D9A62E]">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{email}</span>
            </a>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-[#D9A62E]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main nav */}
      <div className="relative bg-white shadow-sm">
        <div className="container-page flex items-center justify-between py-3">
          <Link href="/" className="flex items-center">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={160}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex lg:items-center lg:gap-7">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-[#0F3D3E]/80 transition-colors hover:text-[#D9A62E]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/search" aria-label="Search" className="text-[#0F3D3E]">
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/tours"
              className="bg-[#D9A62E] px-5 py-2.5 text-sm font-bold text-[#0F3D3E] transition-colors hover:bg-[#c69526]"
            >
              Book a Trip
            </Link>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
