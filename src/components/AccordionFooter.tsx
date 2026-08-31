"use client";

import { useState, type ReactNode } from "react";

/**
 * ============================================================================
 * COLLAPSIBLE FOOTER — reusable across client sites
 * ============================================================================
 * The house-style footer: ONE toggle collapses the entire footer body (brand
 * block + columns) down to just the bottom copyright bar, and the same
 * toggle brings it all back. Not a per-section accordion — a single
 * show/hide switch for the whole thing, so it's built once here and never
 * rebuilt per-project — pass a new client's columns/colors/copy, not a new
 * footer.
 *
 * Colors are passed as CSS custom properties (via the `theme` prop) rather
 * than baked into Tailwind classes, since Tailwind can't generate classes
 * from a runtime hex value — only the values change per client, not the
 * class names.
 * ============================================================================
 */

export interface FooterColumn {
  title: string;
  content: ReactNode;
}

export interface FooterSocialLink {
  label: string;
  href: string;
  iconPath: string;
}

export interface AccordionFooterTheme {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
}

export default function AccordionFooter({
  brand,
  about,
  social = [],
  columns,
  bottomText,
  theme
}: {
  brand: ReactNode;
  about: string;
  social?: FooterSocialLink[];
  columns: FooterColumn[];
  bottomText: string;
  theme: AccordionFooterTheme;
}) {
  const [open, setOpen] = useState(true);

  const style = {
    "--footer-bg": theme.bg,
    "--footer-text": theme.text,
    "--footer-text-muted": theme.textMuted,
    "--footer-accent": theme.accent,
    "--footer-border": theme.border
  } as React.CSSProperties;

  return (
    <footer style={style} className="bg-[var(--footer-bg)] text-[var(--footer-text-muted)]">
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out"
        style={{ maxHeight: open ? "1400px" : "0px", opacity: open ? 1 : 0 }}
        aria-hidden={!open}
      >
        <div className="container-page border-b border-[var(--footer-border)] py-8">
          <div className="text-[var(--footer-text)]">{brand}</div>
          <p className="mt-3 max-w-md text-sm">{about}</p>
          {social.length > 0 && (
            <div className="mt-4 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center border border-[var(--footer-border)] transition-colors hover:border-[var(--footer-accent)] hover:text-[var(--footer-accent)]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={s.iconPath} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="container-page grid gap-8 py-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mono-label text-xs font-semibold uppercase tracking-wide text-[var(--footer-text)]">{col.title}</p>
              <div className="mt-3 text-sm">{col.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--footer-border)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--footer-text)] transition-colors hover:text-[var(--footer-accent)]"
        >
          {open ? "Hide details" : "Show details"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="border-t border-[var(--footer-border)] py-5 text-center text-xs opacity-70">
        {bottomText}
      </div>
    </footer>
  );
}
