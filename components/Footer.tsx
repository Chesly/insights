import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — About */}
        <div className="lg:col-span-1">
          <Image
            src={siteConfig.branding.logoWhite}
            alt={`${siteConfig.shortName} logo`}
            width={168}
            height={42}
            className="h-9 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {siteConfig.footer.about}
          </p>
          <a
            href={siteConfig.footer.ctaButton.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-light"
          >
            {siteConfig.footer.ctaButton.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Column 2 — Services */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
            Our Services
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            {siteConfig.footer.services.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Resources */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
            Resources
          </h3>
          <ul className="space-y-3 text-sm text-white/60" aria-label="Footer navigation">
            {siteConfig.footer.resources.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rss.xml" className="transition-colors hover:text-white">
                RSS Feed
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 — Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">
            Follow Chesly.Tech
          </h3>
          <SocialLinks variant="light" className="flex-wrap" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>{siteConfig.copyright}</p>
          <p>
            Designed and Developed by {siteConfig.owner.name} under{" "}
            <a href={siteConfig.owner.url} className="text-gold hover:underline">
              chesly.tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
