import Link from "next/link";
import Image from "next/image";
import {
  Briefcase, Users, Sun, Plane, Calendar, BadgeCheck,
  Star, Coins, Clock, Headphones, UserCheck, ShieldCheck, ArrowRight,
} from "lucide-react";
import Hero from "@/components/Hero";
import NewsletterForm from "@/components/NewsletterForm";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import { getFeaturedDestinations } from "@/lib/destinations";
import { getFeaturedTours } from "@/lib/tours";
import { getAllServices } from "@/lib/services";
import { getFeaturedArticles } from "@/lib/articles";

const SERVICE_ICONS: Record<string, typeof Briefcase> = {
  "corporate-travel": Briefcase,
  "group-travel": Users,
  "leisure-travel": Sun,
  "flights-accommodation": Plane,
  "mice-events": Calendar,
  "visa-assistance": BadgeCheck,
};

const WHY_US = [
  { icon: Star, label: "Professional Service" },
  { icon: Coins, label: "Cost Savings" },
  { icon: Clock, label: "Time Efficiency" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: UserCheck, label: "Tailor-Made Solutions" },
  { icon: ShieldCheck, label: "Safety" },
];

// Same corporate-travel photo Chesly supplied, used here per the
// placement plan — swap for a people-in-Africa shot when one arrives.
const WHY_US_IMAGE =
  "https://ik.imagekit.io/mkvu8hdr5/time_travel/Corporate_Travel_Hospitality.jpg?updatedAt=1789959940945";

export default async function HomePage() {
  const [destinations, tours, services, articles] = await Promise.all([
    getFeaturedDestinations(),
    getFeaturedTours(),
    getAllServices(),
    getFeaturedArticles(3),
  ]);

  return (
    <div>
      <Hero />

      {/* Popular Destinations */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">
            Popular <span className="font-serif italic text-[#D9A62E]">Destinations</span>
          </h2>
          <Link href="/destinations" className="hidden text-sm font-semibold text-[#0F3D3E]/60 hover:text-[#D9A62E] sm:block">
            View All Destinations
          </Link>
        </div>
        {destinations.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <EmptyState label="Destinations will appear here once added in the CMS." />
        )}
      </section>

      {/* Services */}
      <section className="bg-[#FAF8F3] py-16">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">Our Services</h2>
          <p className="mt-2 text-sm text-[#0F3D3E]/60">Everything you need for a seamless journey.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {services.slice(0, 6).map((s) => {
              const Icon = SERVICE_ICONS[s.slug] || Briefcase;
              return (
                <Link
                  key={s.id}
                  href={`/services/${s.slug}`}
                  className="flex flex-col items-center gap-3 bg-white p-5 text-center transition-shadow hover:shadow-md"
                >
                  <Icon className="h-7 w-7 text-[#D9A62E]" />
                  <span className="text-xs font-semibold text-[#0F3D3E]">{s.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">
            Featured <span className="font-serif italic text-[#D9A62E]">Tours</span>
          </h2>
          <Link href="/tours" className="hidden text-sm font-semibold text-[#0F3D3E]/60 hover:text-[#D9A62E] sm:block">
            View All Tours
          </Link>
        </div>
        {tours.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <EmptyState label="Tours will appear here once added in the CMS." />
        )}
      </section>

      {/* Why Timeline Travel */}
      <section className="bg-[#FAF8F3] py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={WHY_US_IMAGE} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">
              Why <span className="font-serif italic text-[#D9A62E]">Timeline Travel</span>?
            </h2>
            <p className="mt-2 text-sm text-[#0F3D3E]/60">Your trusted travel partner in Africa and beyond.</p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {WHY_US.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-start gap-2">
                  <Icon className="h-6 w-6 text-[#D9A62E]" />
                  <span className="text-sm font-semibold text-[#0F3D3E]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Stories & Guides */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-[#0F3D3E] sm:text-3xl">
            Travel <span className="font-serif italic text-[#D9A62E]">Stories &amp; Guides</span>
          </h2>
          <Link href="/travel-tips" className="hidden text-sm font-semibold text-[#0F3D3E]/60 hover:text-[#D9A62E] sm:block">
            View All Articles
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/travel-tips/${a.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0F3D3E]/5">
                  {a.featuredImage && (
                    <Image src={a.featuredImage} alt={a.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                {a.categoryName && (
                  <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-[#D9A62E]">
                    {a.categoryName}
                  </span>
                )}
                <h3 className="mt-1 font-bold text-[#0F3D3E] group-hover:text-[#D9A62E]">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[#0F3D3E]/60">{a.excerpt}</p>
                <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#0F3D3E]/60">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState label="Travel Tips articles will appear here once published in the CMS." />
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-[#0F3D3E] py-14">
        <div className="container-page flex flex-col items-center gap-4 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-lg font-bold">Get travel inspiration &amp; exclusive offers</h2>
            <p className="mt-1 text-sm text-white/60">
              Join our mailing list for the latest tours, travel tips and special deals.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="mt-8 border border-dashed border-[#0F3D3E]/20 p-8 text-center text-sm text-[#0F3D3E]/50">{label}</p>;
}
