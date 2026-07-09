"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import SearchBar from "./SearchBar";
import SocialLinks from "./SocialLinks";
import Greeting from "./Greeting";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-lg shadow-black/10">

      {/* ── UTILITY BAR ─────────────────────────────────────── */}
      <div className="bg-utility-bg text-utility-text">
        <div className="container-page flex h-[25px] items-center justify-between gap-2 text-xs">
          {/* Greeting — single line, flex-shrink-0 so it never wraps */}
          <span className="shrink-0 truncate">
            <Greeting />
          </span>
          {/* Social icons — tight gap, pushed to right, never grow */}
          <SocialLinks variant="light" className="shrink-0" iconSize="h-6 w-6" />
        </div>
      </div>

      {/* ── MAIN NAV ────────────────────────────────────────── */}
      <div className="bg-navy">
        <div className="container-page flex h-[70px] items-center justify-between gap-3">

          {/* Logo */}
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

          {/* Desktop nav + search */}
          <div className="ml-auto hidden items-center gap-5 md:flex">
            <nav aria-label="Primary" className="flex items-center gap-5">
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
            <SearchBar variant="header" />
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Search icon button */}
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              aria-label="Toggle search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {menuOpen ? (
                /* X icon */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE SEARCH DRAWER ────────────────────────────── */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-navy px-4 py-3 md:hidden">
          <SearchBar variant="header" />
        </div>
      )}

      {/* ── MOBILE MENU DRAWER ──────────────────────────────── */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-navy md:hidden"
        >
          <ul className="flex flex-col divide-y divide-white/5">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-gold ${
                      isActive ? "text-gold" : "text-white/75"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Social links at bottom of mobile menu */}
          <div className="border-t border-white/10 px-4 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Follow Us</p>
            <SocialLinks variant="light" className="gap-2" />
          </div>
        </nav>
      )}
    </header>
  );
}
