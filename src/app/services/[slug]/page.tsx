import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IS_TIMELINE_TRAVEL } from "@/lib/timelinetravel/site";
import { getServiceBySlug } from "@/lib/timelinetravel/services";
import PlaceholderImage from "@/components/timelinetravel/PlaceholderImage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  if (!IS_TIMELINE_TRAVEL) return {};
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.description?.slice(0, 160) };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!IS_TIMELINE_TRAVEL) notFound();

  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div>
      <div className="relative h-64 w-full sm:h-80">
        {service.heroImage ? (
          <Image src={service.heroImage} alt={service.title} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PlaceholderImage variant="suitcase" showCaption={false} tone="deep" className="absolute inset-0 h-full w-full" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{service.title}</h1>
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          {service.description && <p className="text-base leading-relaxed text-[#0F3D3E]/80">{service.description}</p>}
          {service.content && (
            <div
              className="prose mt-6 max-w-none prose-headings:text-[#0F3D3E] prose-a:text-[#D9A62E]"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          )}

          {service.benefits.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Benefits</h2>
              <ul className="mt-4 space-y-2">
                {service.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#0F3D3E]/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A62E]" />
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {service.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#0F3D3E]">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-black/5 border border-black/5">
                {service.faq.map((item, i) => (
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

        <aside className="space-y-3">
          <Link href="/contact" className="block bg-[#D9A62E] px-5 py-3 text-center text-sm font-bold text-[#0F3D3E]">
            Request Assistance
          </Link>
          <Link
            href="/plan-my-trip"
            className="block border border-[#0F3D3E]/20 px-5 py-3 text-center text-sm font-semibold text-[#0F3D3E]"
          >
            Plan My Trip
          </Link>
        </aside>
      </div>
    </div>
  );
}
