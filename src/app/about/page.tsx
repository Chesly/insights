import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: siteConfig.pages.about.title,
  description: `About ${siteConfig.name} — a South African business built on AI, technology and SEO insight, from Chesly.Tech Creative Studio.`
};

// Swap these for real photography whenever you have it — square corners,
// no rounding, matching the picture-driven layout below. Filenames double
// as a shot list: what each spot on the page actually needs.
const PLACEHOLDER = {
  background: "https://placehold.co/900x700/1B2A4A/F4EDD8?text=Background+Photo",
  goal: "https://placehold.co/900x700/8B6914/FFFFFF?text=Our+Goal",
  whoWeAre: "https://placehold.co/900x700/1B2A4A/F4EDD8?text=Who+We+Are",
  compliance: "https://placehold.co/900x700/8B6914/FFFFFF?text=BBBEE+%26+Compliance",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title={siteConfig.pages.about.title}
        subtitle="A South African business built on AI, technology and SEO insight."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* ── Background ─────────────────────────────────────────────── */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PLACEHOLDER.background}
            alt="Chesly.Tech background"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Our Story</p>
          <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">Background</h2>
          <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
            {siteConfig.name} grew out of Chesly.Tech Creative Studio&rsquo;s day-to-day work building
            AI-assisted websites, brands and digital tools for South African businesses. Every week
            we were fielding the same questions from clients and founders about AI, SEO and modern
            web technology — so we started writing the answers down, in plain language, for anyone
            trying to make sense of it.
          </p>
          <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
            What began as internal notes became a publication in its own right — still rooted in
            real client work, not theory.
          </p>
        </div>
      </section>

      {/* ── Our Goal ───────────────────────────────────────────────── */}
      <section className="bg-navy/[0.03] dark:bg-white/5">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Our Goal</p>
            <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">
              Practical clarity, not hype
            </h2>
            <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
              AI and technology coverage is often written to impress, not to help. Our goal is the
              opposite: give South African founders, marketers and professionals insight they can
              actually use — grounded, tested, and written from experience building real websites
              and tools, not from press releases.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLACEHOLDER.goal}
              alt="Our goal"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ───────────────────────────────────────── */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">What Drives Us</p>
          <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">
            Mission &amp; Vision
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="border border-navy/10 p-8 dark:border-white/10">
            <span className="text-3xl" aria-hidden="true">🎯</span>
            <h3 className="mt-4 text-lg font-bold text-navy dark:text-white">Our Mission</h3>
            <p className="mt-2 leading-relaxed text-navy/70 dark:text-white/70">
              To give South African founders, marketers and technologists practical,
              well-researched insight into how AI and modern web technology are reshaping
              business — written from a South Africa-first perspective, for a global audience.
            </p>
          </div>
          <div className="border border-navy/10 p-8 dark:border-white/10">
            <span className="text-3xl" aria-hidden="true">🌟</span>
            <h3 className="mt-4 text-lg font-bold text-navy dark:text-white">Our Vision</h3>
            <p className="mt-2 leading-relaxed text-navy/70 dark:text-white/70">
              To be the clearest, most trusted source of AI, technology and SEO insight for
              South African business — the place people turn to before they turn to hype.
            </p>
          </div>
        </div>
      </section>

      {/* ── Who We Are ─────────────────────────────────────────────── */}
      <section className="bg-navy/[0.03] dark:bg-white/5">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLACEHOLDER.whoWeAre}
              alt="Who we are"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Who We Are</p>
            <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">
              Why we write this
            </h2>
            <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
              {siteConfig.name} is published by <strong>{siteConfig.owner.name}</strong>, an AI
              Creative Strategist and Digital Brand Specialist based in {siteConfig.contact.location},
              and founder of Chesly.Tech Creative Studio and Digitalized Art (Pty) Ltd.
            </p>
            <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
              We assist because most AI and technology content assumes a starting point most
              readers don&rsquo;t have. Every article, guide and tool here comes from the same
              place: a real question asked by a real business, answered honestly, without the
              jargon. If it helps one founder make a clearer decision, it&rsquo;s done its job.
            </p>
          </div>
        </div>
      </section>

      {/* ── BBBEE & Compliance ─────────────────────────────────────── */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Compliance &amp; Transformation</p>
          <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">
            BBBEE &amp; Compliance
          </h2>
          <p className="mt-4 leading-relaxed text-navy/75 dark:text-white/75">
            {siteConfig.companyName} is a 100% South African-owned and independently operated
            business. As a small enterprise, we qualify for Exempt Micro Enterprise (EME) status
            under the B-BBEE Codes of Good Practice, which can be confirmed with a sworn affidavit
            on request — making us a straightforward, low-friction partner for organisations with
            local procurement or transformation goals.
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-2xl font-bold text-gold">100%</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/60 dark:text-white/60">SA Owned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold">EME</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/60 dark:text-white/60">B-BBEE Status</p>
            </div>
          </div>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PLACEHOLDER.compliance}
            alt="BBBEE and compliance"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────── */}
      <section className="bg-navy/[0.03] dark:bg-white/5">
        <div className="container-page py-16 text-center">
          <h2 className="text-xl font-bold text-navy dark:text-white">Get in touch</h2>
          <p className="mt-2 text-navy/70 dark:text-white/70">
            Reach us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-gold hover:underline">
              {siteConfig.contact.email}
            </a>{" "}
            or {siteConfig.contact.phone}.
          </p>
        </div>
      </section>
    </div>
  );
}
