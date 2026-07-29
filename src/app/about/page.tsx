import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import Newsletter from "@/components/Newsletter";

export const metadata: Metadata = {
  title: siteConfig.pages.about.title,
  description: `About ${siteConfig.name} — a South African business built on AI, technology and SEO insight, from Chesly.Tech Creative Studio.`
};

// Real photography — square corners, natural aspect ratio (frame fits the
// image, not the other way around). Swap the one still-missing spot
// (whoWeAre) whenever you have a shot for it.
const IMAGES = {
  breadcrumb: "https://ik.imagekit.io/mkvu8hdr5/insights/chesly-tech-about.jpg",
  background: "https://ik.imagekit.io/mkvu8hdr5/insights/AI-powered%20knowledge%20hub.jpg",
  goal: "https://ik.imagekit.io/mkvu8hdr5/insights/our-goal.jpg",
  whoWeAre: "https://placehold.co/900x700/1B2A4A/F4EDD8?text=Who+We+Are",
  compliance: "https://ik.imagekit.io/mkvu8hdr5/insights/compliance.jpg",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title={siteConfig.pages.about.title}
        subtitle="A South African business built on AI, technology and SEO insight."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        backgroundImage={IMAGES.breadcrumb}
        heightPx={Math.round(siteConfig.pageHero.heightPx * 0.6)}
      />

      {/* ── Background ─────────────────────────────────────────────── */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES.background}
            alt="Chesly.Tech background"
            className="w-full"
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
              src={IMAGES.goal}
              alt="Our goal"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ── Mission, Vision, Values & Promise ──────────────────────── */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">What Drives Us</p>
          <h2 className="mt-2 text-2xl font-bold text-navy dark:text-white sm:text-3xl">
            Mission &amp; Vision
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
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
          <div className="border border-navy/10 p-8 dark:border-white/10">
            <span className="text-3xl" aria-hidden="true">⚖️</span>
            <h3 className="mt-4 text-lg font-bold text-navy dark:text-white">Our Values</h3>
            <p className="mt-2 leading-relaxed text-navy/70 dark:text-white/70">
              Clarity over jargon, evidence over hype, and a South Africa-first perspective in
              everything we publish — because trust is earned one honest article at a time.
            </p>
          </div>
          <div className="border border-navy/10 p-8 dark:border-white/10">
            <span className="text-3xl" aria-hidden="true">🤍</span>
            <h3 className="mt-4 text-lg font-bold text-navy dark:text-white">Our Promise</h3>
            <p className="mt-2 leading-relaxed text-navy/70 dark:text-white/70">
              We simplify life by quietly turning uncertainty into clarity — the same philosophy
              behind every Chesly.Tech product, applied here to how we write and what we publish.
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
              src={IMAGES.whoWeAre}
              alt="Who we are"
              className="w-full"
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
            {siteConfig.name} is published under <strong>Digitalized Art (Pty) Ltd</strong> and its
            community initiative, <strong>Yinhla Cares</strong> — both 100% South African-owned and
            independently operated, and both rated <strong>BBBEE Level 1</strong>. The formal
            affidavit will be issued once the current tax return has been filed, and can be
            supplied on request from that point.
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-2xl font-bold text-gold">Level 1</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/60 dark:text-white/60">BBBEE Status</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold">100%</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy/60 dark:text-white/60">SA Owned</p>
            </div>
          </div>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES.compliance}
            alt="BBBEE and compliance"
            className="w-full"
          />
        </div>
      </section>

      {/* ── Newsletter (replaces the old plain Contact block) ────────── */}
      <Newsletter
        noteBody={siteConfig.editorsNote.body}
        noteSignature={siteConfig.editorsNote.signature}
      />
    </div>
  );
}
