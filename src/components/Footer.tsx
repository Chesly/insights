"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import SocialLinks from "./SocialLinks";

export default function Footer({ settings }: { settings?: Record<string, string> }) {
  // Defaults open (unlike chesly.tech's collapsed-by-default tab) so
  // Privacy/Terms/Contact links stay reachable without an extra click —
  // the toggle just gives visitors the option to tuck the footer away.
  const [expanded, setExpanded] = useState(true);

  // Admin > Settings overrides — fall back to siteConfig.ts when unset.
  const logoFooter = settings?.logo_footer_url || siteConfig.branding.logoFooter;
  const about = settings?.footer_about || siteConfig.footer.about;
  const contactEmail = settings?.contact_email || siteConfig.contact.email;
  const contactPhone = settings?.contact_phone || siteConfig.contact.phone;
  const contactLocation = settings?.contact_location || siteConfig.contact.location;
  const contactHours = settings?.contact_hours || siteConfig.contact.hours;

  return (
    <footer className="relative bg-footer text-white">
      {/* Show/Hide tab — mirrors the collapsible footer on chesly.tech */}
      <div className="absolute -top-6 right-4 z-10 flex items-stretch gap-1.5 sm:right-6">
        <div className="flex items-center whitespace-nowrap rounded-t-md bg-footer px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/50">
          {siteConfig.copyright.replace("All Rights Reserved.", "").trim()}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="footer-body"
          className="flex items-center gap-1.5 rounded-t-md bg-footer px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold"
        >
          {expanded ? "Hide" : "Show"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className={`h-2.5 w-2.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div
        id="footer-body"
        className="overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out grid"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <div className="container-page grid gap-8 py-5 md:grid-cols-2 lg:grid-cols-[380px_1fr_1fr_1fr]">
            {/* Column 1 — Company */}
            <div>
              <Image
                src={logoFooter}
                alt={`${siteConfig.shortName} logo`}
                width={168}
                height={42}
                className="h-9 w-auto"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                {about}
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

            {/* Column 4 — Contact */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-white">
                    {contactEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {contactPhone}
                  </a>
                </li>
                <li>{contactLocation}</li>
                <li>{contactHours}</li>
              </ul>
              <SocialLinks variant="light" className="mt-4 gap-1.5" iconSize="h-8 w-8" settings={settings} />
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
        </div>
      </div>
    </footer>
  );
}
