import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import PageHero from "@/components/PageHero";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: siteConfig.pages.contact.title,
  description: `Get in touch with ${siteConfig.name}.`
};

export default function ContactPage() {
  return (
    <div>
      <PageHero
        title={siteConfig.pages.contact.title}
        subtitle={siteConfig.pages.contact.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <form className="space-y-4 lg:col-span-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Name</label>
            <input
              type="text"
              required
              className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Message</label>
            <textarea
              rows={5}
              required
              className="w-full border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="bg-gold px-6 py-3 font-semibold text-white hover:bg-gold-dark"
          >
            Send Message
          </button>
        </form>

        <aside className="space-y-6">
          <div className="border border-gold/20 p-6">
            <h2 className="font-semibold text-navy dark:text-white">Get in touch</h2>
            <dl className="mt-4 space-y-3 text-sm text-navy/70 dark:text-white/70">
              <div>
                <dt className="font-medium text-navy dark:text-white">Email</dt>
                <dd>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-gold hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Phone</dt>
                <dd>{siteConfig.contact.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Location</dt>
                <dd>{siteConfig.contact.location}</dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Hours</dt>
                <dd>{siteConfig.contact.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-gold/20 p-6">
            <h2 className="font-semibold text-navy dark:text-white">Follow along</h2>
            <div className="mt-3">
              <SocialLinks />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
