import Link from "next/link";

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
    <div className="relative overflow-hidden bg-navy">
      {/* Technology-themed background: layered gradients + circuit-like dot grid (no external image dependency) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,105,20,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(0,212,255,0.25), transparent 45%), radial-gradient(circle at 50% 100%, rgba(139,105,20,0.2), transparent 50%)"
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      {/* Dark overlay ~60% for text legibility */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy/60" />

      <div className="container-page relative py-16 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/60">
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
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}
