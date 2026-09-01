import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getTodaysFact } from "@/lib/facts";
import { getPostsByTag } from "@/lib/posts";
import PackageCard from "@/components/lcdkhaya/PackageCard";
import TestimonialsScroller from "@/components/lcdkhaya/TestimonialsScroller";
import NewsletterSignup from "@/components/lcdkhaya/NewsletterSignup";
import CallbackForm from "@/components/lcdkhaya/CallbackForm";
import HeroSlideshow from "@/components/lcdkhaya/HeroSlideshow";
import ThreeColumnSection from "@/components/lcdkhaya/ThreeColumnSection";

export const metadata: Metadata = { title: { absolute: lcdKhayaConfig.seo.defaultTitle } };
export const revalidate = 3600;

const eyebrowClass = "eyebrow block text-xs font-semibold uppercase tracking-[0.15em] text-[#B8860B]";

export default async function LcdKhayaHomePage() {
  const { sections } = lcdKhayaConfig;
  const [fact, posts] = await Promise.all([getTodaysFact(), getPostsByTag(lcdKhayaConfig.blogTag)]);
  const recentPosts = posts.slice(0, 3);

  return (
    <div>
      {/* Hero / slideshow */}
      {sections.hero && (
        <section className="relative overflow-hidden">
          <HeroSlideshow slides={lcdKhayaConfig.heroSlides}>
            <div className="max-w-lg">
              <span className="inline-block bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                Daveyton &amp; Benoni, Gauteng
              </span>
              <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {lcdKhayaConfig.tagline}
              </h1>
              <p className="mt-3 max-w-lg text-sm text-white/85">{lcdKhayaConfig.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/lcdkhaya/booking" className="bg-[#B8860B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8B6E46]">
                  Book a Lesson
                </Link>
                <Link href="/lcdkhaya/services" className="border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20">
                  View Packages
                </Link>
              </div>
            </div>
          </HeroSlideshow>
        </section>
      )}

      {/* Important information — a stat strip: big serif value, small mono
          label, dark background, bordered columns */}
      {sections.importantInfo && (
        <section className="bg-[#1A1A1A] py-6 text-white">
          <div className="container-page grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            {lcdKhayaConfig.importantInfo.map((item) => (
              <div key={item.label} className="px-4 py-3 text-center first:pl-0 last:pr-0">
                <p className="font-serif text-xl font-bold text-[#D4AF37] sm:text-2xl">{item.value}</p>
                <p className="mono-label mt-1 text-[11px] uppercase tracking-[0.12em] text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Three-column: Learner's Licence / Driving Licence / PrDP */}
      {sections.threeColumn && (
        <section className="container-page py-6">
          <ThreeColumnSection items={lcdKhayaConfig.threeColumn} ctaHref="/lcdkhaya/services" />
        </section>
      )}

      {/* Why choose us — split layout, real photo alongside the cards */}
      {sections.whyChooseUs && (
        <section className="container-page py-6">
          <span className={eyebrowClass}>Our Advantage</span>
          <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">Why Learn With LCD Khaya</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch">
            <div className="relative min-h-[220px] w-full overflow-hidden lg:min-h-0">
              <Image
                src={lcdKhayaConfig.whyChooseUsImage}
                alt="LCD Khaya driving lesson"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {lcdKhayaConfig.whyChooseUs.map((item) => (
                <div key={item.title} className="border border-[#B8860B]/15 bg-white p-5">
                  <h3 className="font-semibold text-[#1A1A1A]">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-[#1A1A1A]/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages preview */}
      {sections.packagesPreview && (
        <section className="bg-white py-6">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <div>
                <span className={eyebrowClass}>Pricing</span>
                <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">Lessons &amp; Packages</h2>
              </div>
              <Link href="/lcdkhaya/services" className="text-sm font-semibold text-[#B8860B] hover:underline">
                View all →
              </Link>
            </div>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lcdKhayaConfig.packages.slice(0, 3).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Did you know — full-bleed background photo, same dark-scrim
          treatment as the hero and page headers */}
      {sections.didYouKnow && fact && (
        <section className="relative overflow-hidden py-10 text-white">
          <Image
            src={lcdKhayaConfig.didYouKnowImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#1A1A1A]/75" aria-hidden="true" />
          <div className="container-page relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="eyebrow block text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">Did You Know?</span>
              <h3 className="mt-1 text-lg font-bold sm:text-xl">{fact.headline}</h3>
              <p className="mt-1 text-sm text-white/80">{fact.fact_text}</p>
            </div>
            <Link
              href="/lcdkhaya/facts"
              className="shrink-0 border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20"
            >
              More Driving Facts
            </Link>
          </div>
        </section>
      )}

      {/* Recent blog */}
      {sections.blogPreview && recentPosts.length > 0 && (
        <section className="bg-white py-6">
          <div className="container-page">
            <span className={eyebrowClass}>Resources</span>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">From the Blog</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
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
      {sections.testimonials && (
        <section className="py-6">
          <div className="container-page">
            <span className={eyebrowClass}>Testimonials</span>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A1A]">What Learners Say</h2>
          </div>
          <div className="mt-4">
            <TestimonialsScroller />
          </div>
        </section>
      )}

      {/* Request a callback */}
      {sections.callback && (
        <section className="container-page py-6">
          <div className="mx-auto max-w-xl">
            <CallbackForm />
          </div>
        </section>
      )}

      {sections.newsletter && <NewsletterSignup />}
    </div>
  );
}
