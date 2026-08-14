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
const SCAN_DEADLINE_MS = 8000;

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
const CHECK_TIMEOUT_MS = 3500;
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
// ~80+ posts one at a time would take minutes. Stops picking up new work
// past the deadline so a handful of slow hosts can't blow the whole scan;
// whatever's left just isn't included in this run's results rather than
// being reported broken.
async function checkUrlsPooled(urls: string[], deadline: number): Promise<Map<string, LinkCheck>> {
  const results = new Map<string, LinkCheck>();
  const queue = [...urls];
  async function worker() {
    while (queue.length > 0 && Date.now() < deadline) {
      const url = queue.shift();
      if (!url) return;
      results.set(url, await checkUrl(url));
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
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

  const deadline = Date.now() + SCAN_DEADLINE_MS;
  const checked = await checkUrlsPooled(Array.from(allUrls), deadline);

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
