import Image from "next/image";
import Link from "next/link";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";

export interface LcdCrumb {
  label: string;
  href?: string;
}

export default function LcdKhayaPageHero({
  title,
  subtitle,
  breadcrumbs
}: {
  title: string;
  subtitle?: string;
  breadcrumbs: LcdCrumb[];
}) {
  return (
    <div className="relative overflow-hidden bg-[#1A1A1A] py-4 text-white sm:py-5">
      <Image
        src={lcdKhayaConfig.pageHeroImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#1A1A1A]/80" aria-hidden="true" />

      <div className="container-page relative">
        <nav aria-label="Breadcrumb" className="mb-1.5 text-xs text-white/50">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#D4AF37]">
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
        <h1 className="text-lg font-bold sm:text-xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-xs text-white/70 sm:text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
