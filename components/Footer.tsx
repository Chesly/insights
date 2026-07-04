import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="container-page grid gap-8 py-5 md:grid-cols-2 lg:grid-cols-[380px_1fr_1fr_1fr]">
        {/* Column 1 — About */}
        <div>
          <Image
            src={siteConfig.branding.logoFooter}
            alt={`${siteConfig.shortName} logo`}
            width={168}
            height={42}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {siteConfig.footer.about}
          </p>
          <a
            href={siteConfig.footer.ctaButton.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-light"
          >
            {siteConfig.footer.ctaButton.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Column 2 — Services */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Our Services
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
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
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-white/60" aria-label="Footer navigation">
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

        {/* Column 4 — Social, with handles */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Follow Chesly.Tech
          </h3>
          <SocialLinks variant="light" showHandles />
        </div>
      </div>

      <div className="bg-footer-copyright">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
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
