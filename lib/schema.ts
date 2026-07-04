import { siteConfig } from "./siteConfig";
import type { Post, Author, HowToStep } from "./types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.shortName,
    url: siteConfig.owner.url,
    logo: { "@type": "ImageObject", url: siteConfig.branding.logoHeader },
    image: siteConfig.branding.logoHeader,
    founder: {
      "@type": "Person",
      name: siteConfig.owner.name
    },
    email: siteConfig.contact.email,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      areaServed: "ZA",
      contactType: "customer service"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.contact.location
    },
    sameAs: siteConfig.social.map((s) => s.href)
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function personSchema(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/author/${author.slug}/#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    image: author.image,
    url: `${siteConfig.url}/author/${author.slug}`,
    email: author.email,
    knowsAbout: author.expertise,
    worksFor: { "@id": `${siteConfig.url}/#organization` },
    sameAs: Object.values(author.social).filter(Boolean)
  };
}

export function articleSchema(post: Post, authorUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.url}/blog/${post.slug}/#article`,
    headline: post.title,
    description: post.description,
    image: [post.image],
    thumbnailUrl: post.image,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.owner.name,
      url: authorUrl
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${post.slug}` },
    articleSection: post.category,
    keywords: [...(post.keywords || []), ...(post.semanticKeywords || [])].join(", "),
    inLanguage: siteConfig.language,
    isAccessibleForFree: true
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
}

export function howToSchema(name: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text
    }))
  };
}

export function collectionPageSchema(name: string, url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    description,
    isPartOf: { "@id": `${siteConfig.url}/#website` }
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url
    }))
  };
}
