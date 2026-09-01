import { NextRequest, NextResponse } from "next/server";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import { getPostsByTag } from "@/lib/posts";

export interface SearchResult {
  type: "Package" | "FAQ" | "Blog" | "Page";
  title: string;
  snippet: string;
  href: string;
}

const STATIC_PAGES = [
  { title: "About", href: "/lcdkhaya/about", snippet: lcdKhayaConfig.description },
  { title: "Services & Packages", href: "/lcdkhaya/services", snippet: "Browse all packages and pricing." },
  { title: "Did You Know?", href: "/lcdkhaya/facts", snippet: "Road safety and K53 facts." },
  { title: "Contact", href: "/lcdkhaya/contact", snippet: "Get in touch or request a callback." },
  { title: "Book a Lesson", href: "/lcdkhaya/booking", snippet: "Book your driving lesson package online." }
];

// Small, all-in-config content set — a simple case-insensitive substring
// match across packages/FAQs/static pages/blog is plenty here; no need
// for a real search index at this scale.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const results: SearchResult[] = [];

  for (const p of lcdKhayaConfig.packages) {
    if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) {
      results.push({ type: "Package", title: p.name, snippet: p.description, href: `/lcdkhaya/booking?package=${p.id}` });
    }
  }

  for (const f of lcdKhayaConfig.faqs) {
    if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
      results.push({ type: "FAQ", title: f.question, snippet: f.answer, href: "/lcdkhaya/faq" });
    }
  }

  for (const p of STATIC_PAGES) {
    if (p.title.toLowerCase().includes(q) || p.snippet.toLowerCase().includes(q)) {
      results.push({ type: "Page", title: p.title, snippet: p.snippet, href: p.href });
    }
  }

  const posts = await getPostsByTag(lcdKhayaConfig.blogTag);
  for (const post of posts) {
    if (post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q)) {
      results.push({ type: "Blog", title: post.title, snippet: post.description, href: `/lcdkhaya/blog/${post.slug}` });
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) });
}
