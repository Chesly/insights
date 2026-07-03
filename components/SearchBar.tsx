"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Result {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export default function SearchBar({ variant = "header" }: { variant?: "header" | "page" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search articles
        </label>
        <input
          id={`${listboxId}-input`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search articles…"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          className={
            variant === "header"
              ? "w-full rounded-full border border-gold/30 bg-white/80 px-4 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold dark:bg-navy-dark/60 dark:text-white"
              : "w-full rounded-lg border border-gold/30 px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold dark:bg-navy-dark/40 dark:text-white"
          }
        />
      </form>

      {open && (loading || results.length > 0) && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gold/20 bg-white shadow-lg dark:bg-navy"
        >
          {loading && (
            <li className="px-4 py-3 text-sm text-navy/50 dark:text-white/50">Searching…</li>
          )}
          {!loading &&
            results.map((r) => (
              <li key={r.slug} role="option" aria-selected="false">
                <Link
                  href={`/blog/${r.slug}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-gold/10 px-4 py-3 last:border-none hover:bg-gold/5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {r.category}
                  </span>
                  <p className="mt-1 text-sm font-medium text-navy dark:text-white">{r.title}</p>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
