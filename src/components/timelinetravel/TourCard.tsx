import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import type { Tour } from "@/lib/timelinetravel/tours";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="group flex flex-col border border-black/5 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {tour.featuredImage ? (
          <Image
            src={tour.featuredImage}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage
            variant="suitcase"
            label={tour.title}
            showCaption={false}
            className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-bold text-[#0F3D3E] hover:text-[#D9A62E]">{tour.title}</h3>
        </Link>

        {tour.startsIn && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#0F3D3E]/60">
            <MapPin className="h-3.5 w-3.5" /> {tour.startsIn}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1 text-xs text-[#0F3D3E]/60">
          <Clock className="h-3.5 w-3.5" /> {tour.durationDays} days
        </p>

        <p className="mt-3 text-sm font-bold text-[#0F3D3E]">
          {tour.fromPrice != null
            ? `From ${tour.fromCurrency} ${tour.fromPrice.toLocaleString("en-ZA")}`
            : "Contact for pricing"}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/tours/${tour.slug}`}
            className="flex-1 border border-[#0F3D3E]/20 px-3 py-2 text-center text-xs font-semibold text-[#0F3D3E] transition-colors hover:border-[#0F3D3E]"
          >
            View Tour
          </Link>
          <Link
            href={`/tours/${tour.slug}#book`}
            className="flex-1 bg-[#D9A62E] px-3 py-2 text-center text-xs font-bold text-[#0F3D3E] transition-colors hover:bg-[#c69526]"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
