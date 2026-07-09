import { siteConfig } from "@/lib/siteConfig";

const icons: Record<string, React.ReactNode> = {
  facebook: (
    <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35C16.24 4.32 15.36 4.24 14.33 4.24c-2.15 0-3.63 1.31-3.63 3.72V10.5H8.25v3h2.45V21h2.8z" />
  ),
  instagram: (
    <path d="M12 2.16c2.67 0 2.99.01 4.04.06 1.05.05 1.77.21 2.4.46.65.25 1.2.6 1.75 1.15.5.5.9 1.1 1.15 1.75.25.63.41 1.35.46 2.4.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.05 1.05-.21 1.77-.46 2.4a4.93 4.93 0 01-1.15 1.75 4.93 4.93 0 01-1.75 1.15c-.63.25-1.35.41-2.4.46-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-1.05-.05-1.77-.21-2.4-.46a4.93 4.93 0 01-1.75-1.15 4.93 4.93 0 01-1.15-1.75c-.25-.63-.41-1.35-.46-2.4C2.17 14.99 2.16 14.67 2.16 12s.01-2.99.06-4.04c.05-1.05.21-1.77.46-2.4.25-.65.6-1.2 1.15-1.75A4.93 4.93 0 015.58 2.66c.63-.25 1.35-.41 2.4-.46C9.03 2.17 9.35 2.16 12 2.16zm0 1.8c-2.63 0-2.92.01-3.96.06-.9.04-1.4.19-1.72.32-.43.17-.74.37-1.07.7-.33.33-.53.64-.7 1.07-.13.32-.28.82-.32 1.72-.05 1.04-.06 1.33-.06 3.96s.01 2.92.06 3.96c.04.9.19 1.4.32 1.72.17.43.37.74.7 1.07.33.33.64.53 1.07.7.32.13.82.28 1.72.32 1.04.05 1.33.06 3.96.06s2.92-.01 3.96-.06c.9-.04 1.4-.19 1.72-.32.43-.17.74-.37 1.07-.7.33-.33.53-.64.7-1.07.13-.32.28-.82.32-1.72.05-1.04.06-1.33.06-3.96s-.01-2.92-.06-3.96c-.04-.9-.19-1.4-.32-1.72a2.88 2.88 0 00-.7-1.07 2.88 2.88 0 00-1.07-.7c-.32-.13-.82-.28-1.72-.32-1.04-.05-1.33-.06-3.96-.06zm0 3.06a4.98 4.98 0 110 9.96 4.98 4.98 0 010-9.96zm0 1.8a3.18 3.18 0 100 6.36 3.18 3.18 0 000-6.36zm5.18-1.99a1.16 1.16 0 11-2.33 0 1.16 1.16 0 012.33 0z" />
  ),
  linkedin: (
    <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.96 1.96 0 100 3.92 1.96 1.96 0 000-3.92zM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.17V20z" />
  ),
  youtube: (
    <path d="M21.58 7.19a2.75 2.75 0 00-1.94-1.95C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.49a2.75 2.75 0 00-1.94 1.95A28.7 28.7 0 002 12a28.7 28.7 0 00.42 4.81 2.75 2.75 0 001.94 1.95c1.74.49 7.64.49 7.64.49s5.9 0 7.64-.49a2.75 2.75 0 001.94-1.95A28.7 28.7 0 0022 12a28.7 28.7 0 00-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z" />
  ),
  pinterest: (
    <path d="M12.02 2C6.5 2 3.5 5.7 3.5 9.7c0 1.9 1.02 4.3 2.65 5.06.25.12.38.06.44-.17.04-.18.25-1 .35-1.4a.4.4 0 00-.09-.38c-.53-.64-.96-1.82-.96-2.92 0-2.83 2.14-5.57 5.79-5.57 3.15 0 5.35 2.15 5.35 5.22 0 3.47-1.75 5.87-4.03 5.87-1.26 0-2.2-1.04-1.9-2.32.36-1.53 1.06-3.18 1.06-4.28 0-.99-.53-1.81-1.63-1.81-1.29 0-2.33 1.34-2.33 3.12 0 1.14.38 1.9.38 1.9s-1.29 5.47-1.52 6.43c-.39 1.65-.06 3.67-.03 3.87.02.12.17.15.24.06.1-.13 1.36-1.69 1.79-3.25.12-.44.7-2.74.7-2.74.35.66 1.35 1.24 2.42 1.24 3.19 0 5.5-2.93 5.5-6.57C20.5 5.94 17.5 2 12.02 2z" />
  ),
  tiktok: (
    <path d="M16.6 5.82a4.6 4.6 0 01-3.77-4.05h-3.2v13.9a2.6 2.6 0 11-2.6-2.6c.23 0 .45.03.66.08V9.9a5.9 5.9 0 00-.66-.04A5.85 5.85 0 006.68 21.6a5.85 5.85 0 005.85-5.85V8.98a7.8 7.8 0 004.07 1.14V6.9a4.55 4.55 0 01-.99-1.08z" />
  )
};

export default function SocialLinks({
  variant = "default",
  showHandles = false,
  className = "",
  iconSize = "h-9 w-9"
}: {
  variant?: "default" | "light";
  showHandles?: boolean;
  className?: string;
  iconSize?: string;
}) {
  const colorClass =
    variant === "light"
      ? "text-white hover:text-gold hover:bg-white/10"
      : "text-navy/60 hover:text-gold hover:bg-gold/10 dark:text-white/60";

  if (showHandles) {
    return (
      <ul className={`space-y-3 ${className}`}>
        {siteConfig.social.map((s) => (
          <li key={s.icon}>
            <a
              href={s.href}
              target="_blank"
              rel="me noopener noreferrer"
              className={`flex items-center gap-3 text-sm transition-colors ${
                variant === "light" ? "text-white/70 hover:text-gold" : "text-navy/70 hover:text-gold"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  {icons[s.icon]}
                </svg>
              </span>
              <span>
                {s.label} <span className="text-white/40">{s.handle}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`flex items-center ${className || "gap-2"}`}>
      {siteConfig.social.map((s) => (
        <a
          key={s.icon}
          href={s.href}
          target="_blank"
          rel="me noopener noreferrer"
          aria-label={s.label}
          className={`flex ${iconSize} items-center justify-center rounded-full transition-colors ${colorClass}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            {icons[s.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}
