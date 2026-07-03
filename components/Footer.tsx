import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-gold/20 bg-navy text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.shortName} logo`}
            width={160}
            height={40}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-md text-sm text-white/70">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Explore
          </h3>
          <ul className="space-y-2 text-sm text-white/70" aria-label="Footer navigation">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/author" className="hover:text-gold">
                Authors
              </Link>
            </li>
            <li>
              <Link href="/rss.xml" className="hover:text-gold">
                RSS Feed
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Legal</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/privacy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gold">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-gold">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 md:flex-row">
          <p>
            &copy; {year} {siteConfig.shortName}. All rights reserved.
          </p>
          <p>
            Owner: {siteConfig.owner.name} ({siteConfig.owner.email}) &middot; Designed and
            Developed by {siteConfig.owner.name} under{" "}
            <a href={siteConfig.owner.url} className="text-gold hover:underline">
              chesly.tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
