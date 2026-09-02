import Link from "next/link";
import { primeHealthMedsConfig as cfg } from "@/lib/primehealthmeds/config";

export default function PrimeHealthMedsFooter() {
  return (
    <footer className="border-t border-[#0f766e]/10 bg-[#F7FAF9] py-10 text-sm">
      <div className="container-page grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-[#0f766e]">{cfg.shortName}</p>
          <p className="mt-2 max-w-xs text-[#111827]/60">{cfg.footer.about}</p>
        </div>
        <div>
          <p className="font-semibold text-[#111827]">Shop</p>
          <ul className="mt-2 space-y-1.5 text-[#111827]/60">
            {cfg.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[#0f766e]">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[#111827]">Contact</p>
          <ul className="mt-2 space-y-1.5 text-[#111827]/60">
            <li><a href={`mailto:${cfg.contact.email}`} className="hover:text-[#0f766e]">{cfg.contact.email}</a></li>
            {cfg.footer.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[#0f766e]">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-page mt-8 border-t border-[#0f766e]/10 pt-4 text-xs text-[#111827]/40">
        © {new Date().getFullYear()} {cfg.shortName}. All rights reserved.
      </div>
    </footer>
  );
}
