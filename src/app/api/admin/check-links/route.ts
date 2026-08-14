import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { siteConfig } from "@/lib/siteConfig";

// This project is on Vercel's Hobby plan, which hard-caps serverless
// functions at 10s no matter what maxDuration is set to — exceeding it
// kills the function outright (empty 500, nothing our own code can
// catch). Keep the checking budget well inside that real ceiling rather
// than the Pro-plan-style budget this used to assume.
export const maxDuration = 10;
const SCAN_DEADLINE_MS = 6500;

interface LinkCheck {
  url: string;
  status: number | null;
  reason: string;
}

interface PostResult {
  id: string;
  title: string;
  slug: string;
  section: string;
  brokenLinks: LinkCheck[];
}

const HREF_RE = /<a\s+[^>]*href="([^"]+)"/gi;
const CHECK_TIMEOUT_MS = 2500;
const CONCURRENCY = 20;

function extractLinks(html: string): string[] {
  const links: string[] = [];
  let m: RegExpExecArray | null;
  HREF_RE.lastIndex = 0;
  while ((m = HREF_RE.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    links.push(href.startsWith("/") ? `${siteConfig.url}${href}` : href);
  }
  return links;
}

async function checkUrl(url: string): Promise<LinkCheck> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  const headers = { "User-Agent": "Mozilla/5.0 (compatible; CheslyTechLinkChecker/1.0)" };
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal, headers });
    // Some servers don't support HEAD (405/501) — retry with GET before
    // concluding the link is actually broken.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal, headers });
    }
    clearTimeout(timeout);
    if (res.status >= 400) {
      return { url, status: res.status, reason: `HTTP ${res.status}` };
    }
    return { url, status: res.status, reason: "ok" };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error && err.name === "AbortError" ? "Timed out" : "Unreachable";
    return { url, status: null, reason: message };
  }
}

// Checks each unique URL once regardless of how many posts reference it,
// with a small concurrency pool — sequentially checking every link across
// ~80+ posts one at a time would take minutes. Races the whole pool
// against a hard budget: a per-iteration deadline check isn't enough,
// since a single in-flight fetch can still take up to CHECK_TIMEOUT_MS
// to settle — on Vercel's Hobby plan (10s hard cap, no exceptions) that
// straggler is exactly what was blowing the whole function past the
// limit and killing it outright. Racing means we return with whatever's
// been checked so far the instant the budget is up, abandoning anything
// still in flight rather than waiting on it.
async function checkUrlsPooled(urls: string[], budgetMs: number): Promise<Map<string, LinkCheck>> {
  const results = new Map<string, LinkCheck>();
  const queue = [...urls];
  let stopped = false;
  async function worker() {
    while (queue.length > 0 && !stopped) {
      const url = queue.shift();
      if (!url) return;
      results.set(url, await checkUrl(url));
    }
  }
  const work = Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  const budget = new Promise<void>((resolve) => setTimeout(() => { stopped = true; resolve(); }, budgetMs));
  await Promise.race([work, budget]);
  return results;
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  const { data: posts, error } = await service
    .from("posts")
    .select("id, title, slug, body, section")
    .not("body", "is", null);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const perPostLinks = new Map<string, string[]>();
  const allUrls = new Set<string>();
  for (const post of posts) {
    const links = extractLinks(post.body || "");
    if (links.length > 0) {
      perPostLinks.set(post.id, links);
      links.forEach((l) => allUrls.add(l));
    }
  }

  const checked = await checkUrlsPooled(Array.from(allUrls), SCAN_DEADLINE_MS);

  const results: PostResult[] = [];
  for (const post of posts) {
    const links = perPostLinks.get(post.id) || [];
    const broken = links
      .map((url) => checked.get(url))
      .filter((c): c is LinkCheck => !!c && (c.status === null || c.status >= 400));
    if (broken.length > 0) {
      results.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        section: post.section || "insights",
        brokenLinks: broken,
      });
    }
  }

  return NextResponse.json({
    scannedAt: new Date().toISOString(),
    postsScanned: posts.length,
    linksChecked: checked.size,
    linksSkipped: allUrls.size - checked.size,
    postsWithBrokenLinks: results.length,
    results,
  });
}
