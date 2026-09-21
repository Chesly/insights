"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center text-[#0F3D3E]"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-t border-black/5 bg-white shadow-lg">
          <ul className="flex flex-col divide-y divide-black/5">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-sm font-medium text-[#0F3D3E]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-4">
              <Link
                href="/tours"
                onClick={() => setOpen(false)}
                className="block w-full bg-[#D9A62E] px-4 py-2.5 text-center text-sm font-bold text-[#0F3D3E]"
              >
                Book a Trip
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
