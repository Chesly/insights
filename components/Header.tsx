import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import SearchBar from "./SearchBar";
import SocialLinks from "./SocialLinks";
import Greeting from "./Greeting";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 shadow-lg shadow-black/10">
      {/* Utility bar */}
      <div className="bg-utility text-utility">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <Greeting />
          <SocialLinks variant="light" className="gap-1" />
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-navy">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            aria-label={`${siteConfig.shortName} home`}
          >
            <Image
              src={siteConfig.branding.logoHeader}
              alt={`${siteConfig.shortName} logo`}
              width={168}
              height={42}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-6 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-xs font-semibold uppercase tracking-wider text-white/75 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <SearchBar variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
}
