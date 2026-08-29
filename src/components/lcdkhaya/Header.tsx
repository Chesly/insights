"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

export default function LcdKhayaHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#B8860B]/20 bg-[#FAF6EC]/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/lcdkhaya" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide text-[#1A1A1A]">
          <span className="text-[#B8860B]">LCD</span> Khaya Driving School
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {lcdKhayaConfig.nav.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[#1A1A1A]/80 transition-colors hover:text-[#B8860B]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${lcdKhayaConfig.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]/80 hover:text-[#B8860B]">
            <Phone className="h-4 w-4" /> {lcdKhayaConfig.contact.phone}
          </a>
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
