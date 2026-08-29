import Link from "next/link";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

export default function LcdKhayaFooter() {
  return (
    <footer className="mt-16 border-t border-[#B8860B]/20 bg-[#1A1A1A] text-white/80">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold text-white">
            <span className="text-[#D4AF37]">LCD</span> Khaya Driving School
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/60">{lcdKhayaConfig.footer.about}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{lcdKhayaConfig.contact.primaryArea}</li>
            <li>
              <a href={`tel:${lcdKhayaConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-[#D4AF37]">
                {lcdKhayaConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${lcdKhayaConfig.contact.email}`} className="hover:text-[#D4AF37]">
                {lcdKhayaConfig.contact.email}
              </a>
            </li>
            <li className="text-white/50">{lcdKhayaConfig.contact.hours}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            {lcdKhayaConfig.footer.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#D4AF37]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {lcdKhayaConfig.name}. All Rights Reserved.
      </div>
    </footer>
  );
}
