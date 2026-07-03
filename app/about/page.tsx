import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — an AI-first publication covering technology, SEO and business, founded by ${siteConfig.owner.name}.`
};

export default function AboutPage() {
  return (
    <div className="container-page prose prose-lg mx-auto max-w-3xl py-16 dark:prose-invert">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is an AI-first technology publication covering artificial
        intelligence, startups, SEO, GEO (Generative Engine Optimization), digital marketing,
        cybersecurity, cloud computing and South African technology news.
      </p>
      <p>
        {siteConfig.name} is founded and published by <strong>{siteConfig.owner.name}</strong>,
        an AI Creative Strategist and Digital Brand Specialist based in Johannesburg, South
        Africa, and the founder of Chesly.Tech Creative Studio and Digitalized Art (Pty) Ltd.
      </p>
      <p>
        Our mission is to give South African founders, marketers, and technologists
        practical, well-researched insight into how AI and modern web technology are
        reshaping business — written from a South Africa-first perspective, for a global
        audience.
      </p>
      <h2>Contact</h2>
      <p>
        Reach us at{" "}
        <a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a>.
      </p>
    </div>
  );
}
