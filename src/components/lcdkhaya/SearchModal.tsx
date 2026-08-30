"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchResult } from "@/app/api/lcdkhaya/search/route";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(() => {
      fetch(`/api/lcdkhaya/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((json) => setResults(json.results || []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        className="p-2 text-[#1A1A1A]/70 hover:text-[#B8860B]"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" onClick={close}>
          <div className="w-full max-w-lg bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-[#B8860B]/20 pb-3">
              <Search className="h-4 w-4 text-[#1A1A1A]/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search packages, FAQs, blog..."
                className="w-full text-sm focus:outline-none"
              />
              <button type="button" onClick={close} aria-label="Close search">
                <X className="h-4 w-4 text-[#1A1A1A]/40" />
              </button>
            </div>

            <div className="mt-3 max-h-96 overflow-y-auto">
              {loading && <p className="py-4 text-center text-sm text-[#1A1A1A]/40">Searching…</p>}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="py-4 text-center text-sm text-[#1A1A1A]/40">No results for &ldquo;{query}&rdquo;.</p>
              )}
              {results.map((r) => (
                <Link
                  key={`${r.type}-${r.href}-${r.title}`}
                  href={r.href}
                  onClick={close}
                  className="block border-b border-[#B8860B]/10 py-3 last:border-0"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#B8860B]">{r.type}</span>
                  <p className="text-sm font-medium text-[#1A1A1A]">{r.title}</p>
                  <p className="line-clamp-1 text-xs text-[#1A1A1A]/50">{r.snippet}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
