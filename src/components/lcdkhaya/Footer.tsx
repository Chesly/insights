import Link from "next/link";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

// lucide-react doesn't ship brand/logo icons (trademark reasons), so —
// same pattern as the main site's components/SocialLinks.tsx — these are
// plain inline SVG paths.
const SOCIAL_ICON_PATHS: Record<string, string> = {
  Facebook: "M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35C16.24 4.32 15.36 4.24 14.33 4.24c-2.15 0-3.63 1.31-3.63 3.72V10.5H8.25v3h2.45V21h2.8z",
  Instagram:
    "M12 2.16c2.67 0 2.99.01 4.04.06 1.05.05 1.77.21 2.4.46.65.25 1.2.6 1.75 1.15.5.5.9 1.1 1.15 1.75.25.63.41 1.35.46 2.4.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.05 1.05-.21 1.77-.46 2.4a4.93 4.93 0 01-1.15 1.75 4.93 4.93 0 01-1.75 1.15c-.63.25-1.35.41-2.4.46-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-1.05-.05-1.77-.21-2.4-.46a4.93 4.93 0 01-1.75-1.15 4.93 4.93 0 01-1.15-1.75c-.25-.63-.41-1.35-.46-2.4C2.17 14.99 2.16 14.67 2.16 12s.01-2.99.06-4.04c.05-1.05.21-1.77.46-2.4.25-.65.6-1.2 1.15-1.75A4.93 4.93 0 015.58 2.66c.63-.25 1.35-.41 2.4-.46C9.03 2.17 9.35 2.16 12 2.16zm0 1.8c-2.63 0-2.92.01-3.96.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.07.7-.33.33-.53.64-.7 1.07-.13.32-.28.82-.32 1.72-.05 1.04-.06 1.33-.06 3.96s.01 2.92.06 3.96c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.07.33.33.64.53 1.07.7.32.13.82.28 1.72.32 1.04.05 1.33.06 3.96.06s2.92-.01 3.96-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.07-.7.33-.33.53-.64.7-1.07.13-.32.28-.82.32-1.72.05-1.04.06-1.33.06-3.96s-.01-2.92-.06-3.96c-.04-.9-.19-1.4-.32-1.72a2.88 2.88 0 00-.7-1.07 2.88 2.88 0 00-1.07-.7c-.32-.13-.82-.28-1.72-.32-1.04-.05-1.33-.06-3.96-.06zm0 3.06a4.98 4.98 0 110 9.96 4.98 4.98 0 010-9.96zm0 1.8a3.18 3.18 0 100 6.36 3.18 3.18 0 000-6.36zm5.18-1.99a1.16 1.16 0 11-2.33 0 1.16 1.16 0 012.33 0z",
  TikTok:
    "M16.6 5.82a4.6 4.6 0 01-3.77-4.05h-3.2v13.9a2.6 2.6 0 11-2.6-2.6c.23 0 .45.03.66.08V9.9a5.9 5.9 0 00-.66-.04A5.85 5.85 0 006.68 21.6a5.85 5.85 0 005.85-5.85V8.98a7.8 7.8 0 004.07 1.14V6.9a4.55 4.55 0 01-.99-1.08z"
};

export default function LcdKhayaFooter() {
  return (
    <footer className="mt-16 border-t border-[#B8860B]/20 bg-[#1A1A1A] text-white/80">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-bold text-white">
            <span className="text-[#D4AF37]">LCD</span> Khaya Driving School
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/60">{lcdKhayaConfig.footer.about}</p>
          {lcdKhayaConfig.social.length > 0 && (
            <div className="mt-4 flex gap-3">
              {lcdKhayaConfig.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${lcdKhayaConfig.shortName} on ${s.label}`}
                  className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={SOCIAL_ICON_PATHS[s.label]} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Branches</p>
          <ul className="mt-3 space-y-3 text-sm">
            {lcdKhayaConfig.branches.map((b) => (
              <li key={b.name}>
                <p className="font-medium text-white">{b.name}</p>
                {b.addressLines.map((line) => (
                  <p key={line} className="text-white/50">{line}</p>
                ))}
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="text-white/60 hover:text-[#D4AF37]">
                  {b.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
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
          </ul>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/50">Office Hours</p>
          <ul className="mt-2 space-y-1 text-sm text-white/50">
            {lcdKhayaConfig.officeHours.map((d) => (
              <li key={d.label}>{d.label}: {d.hours}</li>
            ))}
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
        © {new Date().getFullYear()} {lcdKhayaConfig.name}. Since {lcdKhayaConfig.foundedYear}. All Rights Reserved.
      </div>
    </footer>
  );
}
