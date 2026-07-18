"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Result {
  slug: string;
  title: string;
  category: string;
  description: string;
}

// Next.js doesn't pass the attempted URL into not-found.tsx, but the
// browser's address bar still shows it — so we read it client-side and
// turn the slug into a search query. "/blog/how-ai-helps-small-business"
// becomes "how ai helps small business", searched against real content.
export default function SmartSuggestions() {
  const pathname = usePathname();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const words = pathname
      .split("/")
      .filter(Boolean)
      .join(" ")
      .replace(/[-_]/g, " ")
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .trim();

    if (words.length < 3) {
      setLoading(false);
      return;
    }

    fetch(`/api/search?q=${encodeURIComponent(words)}`)
      .then((r) => r.json())
      .then((data) => setResults((data.results || []).slice(0, 3)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [pathname]);

  if (loading || results.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-2xl">
      <p className="text-sm font-semibold text-navy/70 dark:text-white/70">
        You might be looking for…
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {results.map((r) => (
          <Link
            key={r.slug}
            href={`/blog/${r.slug}`}
            className="border border-gold/15 p-4 text-left hover:border-gold/40 hover:bg-gold/5 transition-colors"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
              {r.category}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-navy line-clamp-2 dark:text-white">
              {r.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
