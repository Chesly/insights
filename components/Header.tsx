"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import SearchBar from "./SearchBar";
import SocialLinks from "./SocialLinks";
import Greeting from "./Greeting";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 shadow-lg shadow-black/10">
      {/* Utility bar */}
      <div className="bg-utility-bg text-utility-text">
        <div className="container-page flex h-[25px] items-center justify-between text-xs">
          <Greeting />
          <SocialLinks variant="light" className="gap-1" />
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-navy">
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
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
              className="h-8 w-auto"
            />
          </Link>

          <div className="ml-auto flex items-center gap-5">
            <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
              {siteConfig.nav.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active ${
                      isActive ? "text-active" : "text-white/75"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:block">
              <SearchBar variant="header" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
