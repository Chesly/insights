import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`
};

export default function ContactPage() {
  return (
    <div className="container-page mx-auto max-w-2xl py-16">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Contact Us</h1>
      <p className="mt-3 text-navy/60 dark:text-white/60">
        Questions, tips, or partnership enquiries? Reach out below.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Name</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-lg border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy dark:text-white">Message</label>
          <textarea
            rows={5}
            required
            className="w-full rounded-lg border border-gold/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gold px-6 py-3 font-semibold text-white hover:bg-gold-dark"
        >
          Send Message
        </button>
      </form>

      <p className="mt-8 text-sm text-navy/60 dark:text-white/60">
        Or email us directly at{" "}
        <a href={`mailto:${siteConfig.owner.email}`} className="text-gold hover:underline">
          {siteConfig.owner.email}
        </a>
      </p>
    </div>
  );
}
