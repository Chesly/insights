"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import SearchModal from "./SearchModal";

export default function LcdKhayaHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EC]/95 backdrop-blur">
      {/* Utility bar — contact + social + quote link, always visible above the nav */}
      <div className="hidden bg-[#1A1A1A] text-white/80 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${lcdKhayaConfig.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-[#D4AF37]">
              <Phone className="h-3 w-3" /> {lcdKhayaConfig.contact.phone}
            </a>
            <a href={`mailto:${lcdKhayaConfig.contact.email}`} className="flex items-center gap-1.5 hover:text-[#D4AF37]">
              <Mail className="h-3 w-3" /> {lcdKhayaConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/lcdkhaya/contact" className="font-semibold text-[#D4AF37] hover:underline">
              Get a Quote
            </Link>
            {lcdKhayaConfig.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-[#B8860B]/20">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/lcdkhaya" className="flex items-center">
            <Image src={lcdKhayaConfig.branding.logoHorizontal} alt={lcdKhayaConfig.name} width={220} height={63} className="h-11 w-auto" priority />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {lcdKhayaConfig.nav.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-[#1A1A1A]/80 transition-colors hover:text-[#B8860B]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <SearchModal />
            <Link
              href="/lcdkhaya/booking"
              className="bg-[#B8860B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46]"
            >
              Book a Lesson
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-[#1A1A1A] lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Primary mobile" className="border-t border-[#B8860B]/20 bg-[#FAF6EC] lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {lcdKhayaConfig.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 text-sm font-medium text-[#1A1A1A]/80 hover:text-[#B8860B]"
              >
                {link.label}
              </Link>
            ))}
            <a href={`tel:${lcdKhayaConfig.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 px-2 py-2.5 text-sm font-medium text-[#1A1A1A]/80">
              <Phone className="h-4 w-4" /> {lcdKhayaConfig.contact.phone}
            </a>
            <Link
              href="/lcdkhaya/booking"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#B8860B] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Book a Lesson
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
