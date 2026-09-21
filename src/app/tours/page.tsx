import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { getAllTours } from "@/lib/timelinetravel/tours";
import TourCard from "@/components/timelinetravel/TourCard";

export const metadata: Metadata = { title: "Tours" };

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; type?: string; date?: string }>;
}) {
  if (!IS_TIMELINE_TRAVEL) notFound();

  const { destination, type } = await searchParams;
  const allTours = await getAllTours();

  // Real filtering against CMS-backed content (destination free-text
  // match against startsIn/endsIn/title; type against style) — not a
  // fake search box. Date isn't filtered against yet since tours are
  // flexible-date packages, not fixed departures (see task notes).
  const filtered = allTours.filter((t) => {
    const matchesDestination = !destination || [t.title, t.startsIn, t.endsIn]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(destination.toLowerCase()));
    const matchesType = !type || (t.style || "").toLowerCase().includes(type.toLowerCase());
    return matchesDestination && matchesType;
  });

  return (
    <div className="container-page py-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A62E]">Book a Trip</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#0F3D3E] sm:text-4xl">Tours</h1>
      {(destination || type) && (
        <p className="mt-2 text-sm text-[#0F3D3E]/60">
          Showing results {destination && <>for &ldquo;{destination}&rdquo;</>} {type && <>· {type}</>}
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-dashed border-[#0F3D3E]/20 p-8 text-center text-sm text-[#0F3D3E]/50">
          {allTours.length === 0
            ? "Tours will appear here once added in the CMS."
            : "No tours match that search — try a different destination or type."}
        </p>
      )}
    </div>
  );
}
