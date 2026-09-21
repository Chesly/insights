import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationBySlug } from "@/lib/destinations";
import { getAllTours } from "@/lib/tours";
import TourCard from "@/components/TourCard";
import PlaceholderImage from "@/components/PlaceholderImage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  return {
    title: destination.title,
    description: destination.description?.slice(0, 160),
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const allTours = await getAllTours();
  const relatedTours = allTours.filter(
    (t) => t.startsIn?.toLowerCase().includes(destination.title.toLowerCase()) ||
           t.endsIn?.toLowerCase().includes(destination.title.toLowerCase())
  );

  return (
    <div>
      <div className="relative h-72 w-full sm:h-96">
        {destination.heroImage ? (
          <Image src={destination.heroImage} alt={destination.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderImage variant="mountain" showCaption={false} tone="deep" className="absolute inset-0 h-full w-full" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{destination.title}</h1>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {destination.description && (
            <p className="text-base leading-relaxed text-[#0F3D3E]/80">{destination.description}</p>
          )}

          {destination.thingsToDo.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Things to Do</h2>
              <ul className="mt-4 space-y-3">
                {destination.thingsToDo.map((item, i) => (
                  <li key={i} className="border-l-2 border-[#D9A62E] pl-4">
                    <p className="font-semibold text-[#0F3D3E]">{item.title}</p>
                    {item.description && <p className="mt-1 text-sm text-[#0F3D3E]/60">{item.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {destination.travelInfo && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Travel Information</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#0F3D3E]/70">{destination.travelInfo}</p>
            </section>
          )}

          {destination.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-black/5 border border-black/5">
                {destination.faq.map((item, i) => (
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
        </div>

        <aside>
          <Link href="/tours" className="block bg-[#D9A62E] px-5 py-3 text-center text-sm font-bold text-[#0F3D3E]">
            Explore Tours
          </Link>
        </aside>
      </div>

      {relatedTours.length > 0 && (
        <section className="border-t border-black/5 bg-[#FAF8F3] py-14">
          <div className="container-page">
            <h2 className="text-xl font-bold text-[#0F3D3E]">Recommended Tours</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
