import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export interface Crumb {
  label: string;
  href?: string;
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbs
}: {
  title: string;
  subtitle?: string;
  breadcrumbs: Crumb[];
}) {
  return (
    <div
      className="relative flex items-end overflow-hidden bg-utility-bg"
      style={{ height: `${siteConfig.pageHero.heightPx}px` }}
    >
      {/* Background image at ~40% opacity */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${siteConfig.pageHero.backgroundImage})`,
          opacity: 1 - siteConfig.pageHero.overlayOpacity
        }}
      />
      {/* Dark overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-utility-bg"
        style={{ opacity: siteConfig.pageHero.overlayOpacity }}
      />

      <div className="container-page relative w-full pb-6">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-white/60">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-gold">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}
