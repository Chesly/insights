import Link from "next/link";

export interface PhmCrumb {
  label: string;
  href?: string;
}

// No hero photography is available yet for this placeholder storefront
// (see PRIMEHEALTHMEDS-SETUP.md) — a gradient stands in for a background
// image rather than pointing at a fabricated photo URL.
export default function PrimeHealthMedsPageHero({
  title,
  subtitle,
  breadcrumbs
}: {
  title: string;
  subtitle?: string;
  breadcrumbs: PhmCrumb[];
}) {
  return (
    <div className="bg-gradient-to-r from-[#0d5f59] to-[#0f766e] py-8 text-white sm:py-10">
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="mb-2 text-xs text-white/60">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                ) : (
                  <span className="text-white" aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-white/80">{subtitle}</p>}
      </div>
    </div>
  );
}
