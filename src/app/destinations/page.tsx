import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { getAllDestinations } from "@/lib/timelinetravel/destinations";
import DestinationCard from "@/components/timelinetravel/DestinationCard";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  if (!IS_TIMELINE_TRAVEL) notFound();

  const destinations = await getAllDestinations();

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">Explore</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Destinations</h1>

      {destinations.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-dashed border-[#0F3D3E]/20 p-8 text-center text-sm text-[#0F3D3E]/50">
          Destinations will appear here once added in the CMS.
        </p>
      )}
    </div>
  );
}
