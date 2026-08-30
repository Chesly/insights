import type { ReactNode } from "react";

/**
 * ============================================================================
 * ACCORDION FOOTER — reusable across client sites
 * ============================================================================
 * The house-style footer: collapsible sections (native <details>/<summary>,
 * so "click to expand/collapse" works with zero JS) instead of a fixed
 * always-expanded grid. Built once here so it never needs rebuilding
 * per-project — pass a new client's columns/colors/copy, not a new footer.
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
  const style = {
    "--footer-bg": theme.bg,
    "--footer-text": theme.text,
    "--footer-text-muted": theme.textMuted,
    "--footer-accent": theme.accent,
    "--footer-border": theme.border
  } as React.CSSProperties;

  return (
    <footer style={style} className="bg-[var(--footer-bg)] text-[var(--footer-text-muted)]">
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

      <div className="container-page divide-y divide-[var(--footer-border)]">
        {columns.map((col) => (
          <details key={col.title} className="group py-1" open={false}>
            <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide text-[var(--footer-text)]">
              {col.title}
              <span className="text-[var(--footer-accent)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="pb-4 text-sm">{col.content}</div>
          </details>
        ))}
      </div>

      <div className="border-t border-[var(--footer-border)] py-5 text-center text-xs opacity-70">
        {bottomText}
      </div>
    </footer>
  );
}
