"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";
import { useCart } from "@/lib/cart/CartContext";

export default function PrimeHealthMedsHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#0f766e]/10 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/primehealthmeds" className="flex items-center gap-2 text-lg font-bold text-[#0f766e]">
          <span aria-hidden="true">💊</span>
          {cfg.shortName}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {cfg.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#111827]/80 hover:text-[#0f766e]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {cfg.contact.phone && !cfg.contact.phone.startsWith("PLACEHOLDER") && (
            <a href={`tel:${cfg.contact.phone.replace(/\s/g, "")}`} className="hidden items-center gap-1.5 text-sm text-[#111827]/70 hover:text-[#0f766e] lg:flex">
              <Phone className="h-3.5 w-3.5" /> {cfg.contact.phone}
            </a>
          )}
          <Link href="/cart" className="relative flex items-center text-[#0f766e]" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0f766e] text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button type="button" onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[#0f766e]/10 bg-white lg:hidden">
          <div className="container-page flex flex-col py-3">
            {cfg.nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-[#111827]/80 hover:text-[#0f766e]">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
