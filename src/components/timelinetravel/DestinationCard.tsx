import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import type { Destination } from "@/lib/timelinetravel/destinations";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden"
    >
      {destination.heroImage ? (
        <Image
          src={destination.heroImage}
          alt={destination.title}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <PlaceholderImage
          variant="mountain"
          label={destination.title}
          showCaption={false}
          className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <span className="text-sm font-bold text-white">{destination.title}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors group-hover:bg-[#D9A62E] group-hover:text-[#0F3D3E]">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
