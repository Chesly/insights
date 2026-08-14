import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getAllSiteSettings } from "@/lib/settings";
import PageHero from "@/components/PageHero";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: siteConfig.pages.contact.title,
  description: `Get in touch with ${siteConfig.name}.`
};

export const revalidate = 3600;

export default async function ContactPage() {
  const settings = await getAllSiteSettings();
  const email = settings.contact_email || siteConfig.contact.email;
  const phone = settings.contact_phone || siteConfig.contact.phone;
  const location = settings.contact_location || siteConfig.contact.location;
  const hours = settings.contact_hours || siteConfig.contact.hours;

  return (
    <div>
      <PageHero
        title={siteConfig.pages.contact.title}
        subtitle={siteConfig.pages.contact.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-3">
        <ContactForm />

        <aside className="space-y-6">
          <div className="border border-gold/20 p-6">
            <h2 className="font-semibold text-navy dark:text-white">Get in touch</h2>
            <dl className="mt-4 space-y-3 text-sm text-navy/70 dark:text-white/70">
              <div>
                <dt className="font-medium text-navy dark:text-white">Email</dt>
                <dd>
                  <a href={`mailto:${email}`} className="text-gold hover:underline">
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Phone</dt>
                <dd>{phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Location</dt>
                <dd>{location}</dd>
              </div>
              <div>
                <dt className="font-medium text-navy dark:text-white">Hours</dt>
                <dd>{hours}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-gold/20 p-6">
            <h2 className="font-semibold text-navy dark:text-white">Follow along</h2>
            <div className="mt-3">
              <SocialLinks settings={settings} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
