import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy shadow-lg shadow-black/10">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          aria-label={`${siteConfig.shortName} home`}
        >
          <Image
            src={siteConfig.branding.logoWhite}
            alt={`${siteConfig.shortName} logo`}
            width={168}
            height={42}
            priority
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded text-sm font-medium text-white/75 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-end lg:flex">
          <SearchBar variant="header" />
        </div>

        <Link
          href="/blog"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Read Articles
        </Link>
      </div>
    </header>
  );
}
