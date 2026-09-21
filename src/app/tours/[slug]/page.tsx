import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Users, Check, X as XIcon } from "lucide-react";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { getTourBySlug } from "@/lib/timelinetravel/tours";
import PlaceholderImage from "@/components/timelinetravel/PlaceholderImage";
import BookingForm from "@/components/timelinetravel/BookingForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  if (!IS_TIMELINE_TRAVEL) return {};
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  return { title: tour.title, description: tour.introduction?.slice(0, 160) };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!IS_TIMELINE_TRAVEL) notFound();

  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <div>
      <div className="relative h-72 w-full sm:h-96">
        {tour.featuredImage ? (
          <Image src={tour.featuredImage} alt={tour.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderImage variant="suitcase" showCaption={false} tone="deep" className="absolute inset-0 h-full w-full" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8 text-white">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{tour.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/80">
            {tour.startsIn && (
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {tour.startsIn}</span>
            )}
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {tour.durationDays} days</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Min {tour.minPax} pax</span>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          {tour.introduction && <p className="text-base leading-relaxed text-[#0F3D3E]/80">{tour.introduction}</p>}

          {tour.gallery.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-2">
              {tour.gallery.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden">
                  <Image src={src} alt={`${tour.title} photo ${i + 1}`} fill sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {tour.itinerary.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Itinerary</h2>
              <div className="mt-4 space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.dayNumber} className="border-l-2 border-[#D9A62E] pl-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#D9A62E]">Day {day.dayNumber}</p>
                    <h3 className="mt-1 font-bold text-[#0F3D3E]">{day.title}</h3>
                    {day.description && <p className="mt-2 text-sm leading-relaxed text-[#0F3D3E]/70">{day.description}</p>}
                    <dl className="mt-3 grid gap-1 text-xs text-[#0F3D3E]/60 sm:grid-cols-3">
                      {day.mainDestination && (
                        <div><dt className="font-semibold text-[#0F3D3E]/80">Destination</dt><dd>{day.mainDestination}</dd></div>
                      )}
                      {day.accommodation && (
                        <div><dt className="font-semibold text-[#0F3D3E]/80">Accommodation</dt><dd>{day.accommodation}</dd></div>
                      )}
                      {day.meals && (
                        <div><dt className="font-semibold text-[#0F3D3E]/80">Meals</dt><dd>{day.meals}</dd></div>
                      )}
                    </dl>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(tour.included.length > 0 || tour.excluded.length > 0) && (
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              {tour.included.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#0F3D3E]">What&apos;s Included</h2>
                  <ul className="mt-3 space-y-2">
                    {tour.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#0F3D3E]/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A62E]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.excluded.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#0F3D3E]">What&apos;s Excluded</h2>
                  <ul className="mt-3 space-y-2">
                    {tour.excluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#0F3D3E]/70">
                        <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#0F3D3E]/30" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {tour.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-black/5 border border-black/5">
                {tour.faq.map((item, i) => (
                  <details key={i} className="group p-4">
                    <summary className="cursor-pointer list-none font-medium text-[#0F3D3E] marker:content-none">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-sm text-[#0F3D3E]/70">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <p className="mt-10 border-t border-black/5 pt-6 text-xs text-[#0F3D3E]/50">
            Full deposit, payment and cancellation terms: <Link href="/booking-terms" className="underline hover:text-[#D9A62E]">Booking Terms &amp; Conditions</Link>.
          </p>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <BookingForm tour={tour} />
          <Link
            href="/contact"
            className="block border border-[#0F3D3E]/20 px-5 py-3 text-center text-sm font-semibold text-[#0F3D3E]"
          >
            Ask About This Tour
          </Link>
        </aside>
      </div>
    </div>
  );
}
