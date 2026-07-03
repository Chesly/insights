import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-white/90 backdrop-blur dark:bg-navy/90">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${siteConfig.shortName} home`}>
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.shortName} logo`}
            width={160}
            height={40}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded text-sm font-medium text-navy/80 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold dark:text-white/80 dark:hover:text-gold"
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
          className="shrink-0 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          Read Articles
        </Link>
      </div>
    </header>
  );
}
