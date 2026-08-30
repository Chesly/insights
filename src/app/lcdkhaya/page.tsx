import Link from "next/link";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getTodaysFact } from "@/lib/facts";
import { getPostsByTag } from "@/lib/posts";
import PackageCard from "@/components/lcdkhaya/PackageCard";
import TestimonialsScroller from "@/components/lcdkhaya/TestimonialsScroller";
import NewsletterSignup from "@/components/lcdkhaya/NewsletterSignup";
import CallbackForm from "@/components/lcdkhaya/CallbackForm";
import GalleryCarousel from "@/components/lcdkhaya/GalleryCarousel";

export const metadata: Metadata = { title: { absolute: lcdKhayaConfig.seo.defaultTitle } };
export const revalidate = 3600;

export default async function LcdKhayaHomePage() {
  const [fact, posts] = await Promise.all([getTodaysFact(), getPostsByTag(lcdKhayaConfig.blogTag)]);
  const recentPosts = posts.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <span className="inline-block bg-[#B8860B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8B6E46]">
              Daveyton &amp; Benoni, Gauteng
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
              {lcdKhayaConfig.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-[#1A1A1A]/70">{lcdKhayaConfig.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/lcdkhaya/booking" className="bg-[#B8860B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46]">
                Book a Lesson
              </Link>
              <Link href="/lcdkhaya/services" className="border border-[#1A1A1A]/20 px-6 py-3.5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:border-[#B8860B] hover:text-[#B8860B]">
                View Packages
              </Link>
            </div>
          </div>
          <div>
            <GalleryCarousel slides={lcdKhayaConfig.galleryPhotos.slice(0, 6)} />
            <Link href="/lcdkhaya/gallery" className="mt-3 block text-center text-sm font-semibold text-[#B8860B] hover:underline">
              See more real results →
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page py-14">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Why Learn With LCD Khaya</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lcdKhayaConfig.whyChooseUs.map((item) => (
            <div key={item.title} className="border border-[#B8860B]/15 bg-white p-6">
              <h3 className="font-semibold text-[#1A1A1A]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#1A1A1A]/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-white py-14">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Lessons &amp; Packages</h2>
            <Link href="/lcdkhaya/services" className="text-sm font-semibold text-[#B8860B] hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lcdKhayaConfig.packages.slice(0, 3).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Did you know */}
      {fact && (
        <section className="container-page py-14">
          <div className="flex flex-col gap-6 border border-[#B8860B]/20 bg-[#8B6E46]/5 p-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8B6E46]">Did You Know?</span>
              <h3 className="mt-2 text-lg font-bold text-[#1A1A1A]">{fact.headline}</h3>
              <p className="mt-2 text-sm text-[#1A1A1A]/70">{fact.fact_text}</p>
            </div>
            <Link href="/lcdkhaya/facts" className="shrink-0 border border-[#1A1A1A]/20 px-5 py-2.5 text-sm font-semibold hover:border-[#B8860B] hover:text-[#B8860B]">
              More Driving Facts
            </Link>
          </div>
        </section>
      )}

      {/* Recent blog */}
      {recentPosts.length > 0 && (
        <section className="bg-white py-14">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">From the Blog</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/lcdkhaya/blog/${post.slug}`} className="group border border-[#B8860B]/15 p-5">
                  <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8860B]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#1A1A1A]/60">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-14">
        <h2 className="container-page text-2xl font-bold text-[#1A1A1A]">What Learners Say</h2>
        <div className="mt-8">
          <TestimonialsScroller />
        </div>
      </section>

      {/* Request a callback */}
      <section className="container-page py-14">
        <div className="mx-auto max-w-xl">
          <CallbackForm />
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}
