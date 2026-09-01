import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";

export interface ThreeColumnItem {
  title: string;
  description: string;
  cta: string;
  // Real photo, once available. Falls back to a placeholder motif when a
  // client's photography isn't ready yet — same slot/aspect-ratio either
  // way, so this is a data change, not a layout change.
  image?: string;
  variant?: "road" | "wheel" | "car" | "sign";
}

// Responsive by default via the grid breakpoints alone: 1 column on
// mobile, 2 on tablet, 3 on desktop — no separate mobile layout to
// maintain.
export default function ThreeColumnSection({ items, ctaHref }: { items: ThreeColumnItem[]; ctaHref: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col border border-[#B8860B]/15 bg-white">
          {item.image ? (
            <div className="relative aspect-[4/3] w-full">
              <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <PlaceholderImage variant={item.variant ?? "road"} label="Photo coming soon" className="aspect-[4/3] w-full" />
          )}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-bold text-[#1A1A1A]">{item.title}</h3>
            <p className="mt-1.5 flex-1 text-sm text-[#1A1A1A]/60">{item.description}</p>
            <Link href={ctaHref} className="mt-3 text-sm font-semibold text-[#B8860B] hover:underline">
              {item.cta} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
