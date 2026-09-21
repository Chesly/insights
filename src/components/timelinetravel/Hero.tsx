import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Search } from "lucide-react";

// Single background photo for now (the Cape Town / Table Mountain shot
// Chesly supplied "for the slideshow") — swap this for an actual rotating
// HeroSlideshow (see components/lcdkhaya/HeroSlideshow.tsx for the
// existing pattern to reuse) once more hero-suitable photos arrive.
const HERO_IMAGE =
  "https://ik.imagekit.io/mkvu8hdr5/time_travel/Cape_Town_Landscape_Table_Mountain.jpg?updatedAt=1789960087295";

const TRAVEL_TYPES = [
  "Leisure Travel",
  "Corporate Travel",
  "Group Travel",
  "Business Travel",
  "MICE / Events",
  "Adventure Travel",
  "Family Travel",
  "Honeymoon",
  "Wildlife",
  "Other",
];

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[560px] w-full sm:h-[620px]">
        <Image src={HERO_IMAGE} alt="" fill priority className="object-cover" sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="container-page relative flex h-full flex-col justify-center pb-24 text-white">
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Travel Beyond Destinations.{" "}
            <span className="text-[#D9A62E]">Create Meaningful Journeys.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
            We make travel easier, safer, more efficient and more rewarding for every client we serve.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tours" className="bg-[#D9A62E] px-6 py-3 text-sm font-bold text-[#0F3D3E]">
              Explore Tours
            </Link>
            <Link
              href="/plan-my-trip"
              className="border border-white/70 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Search panel — real GET form to /tours (query-param filtering
          lands with the Tours listing page; the box itself is wired now
          so it's a genuine control, not a placeholder). */}
      <div className="container-page relative -mt-14 sm:-mt-16">
        <form
          action="/tours"
          method="get"
          className="grid gap-3 bg-white p-4 shadow-xl sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end sm:p-5"
        >
          <label className="block text-left">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#0F3D3E]/60">
              <MapPin className="h-3.5 w-3.5" /> Destination
            </span>
            <input
              name="destination"
              type="text"
              placeholder="Where do you want to go?"
              className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] placeholder:text-[#0F3D3E]/40 focus:border-[#D9A62E] focus:outline-none"
            />
          </label>

          <label className="block text-left">
            <span className="mb-1 block text-xs font-semibold text-[#0F3D3E]/60">Travel Type</span>
            <select
              name="type"
              defaultValue=""
              className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
            >
              <option value="">Any type</option>
              {TRAVEL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="block text-left">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#0F3D3E]/60">
              <Calendar className="h-3.5 w-3.5" /> Travel Date
            </span>
            <input
              name="date"
              type="date"
              className="w-full border border-black/10 px-3 py-2.5 text-sm text-[#0F3D3E] focus:border-[#D9A62E] focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#0F3D3E] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a2929]"
          >
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
      </div>
    </section>
  );
}
