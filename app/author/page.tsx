import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getAllAuthors } from "@/lib/authors";

export const metadata: Metadata = {
  title: "Authors",
  description: `Meet the writers and contributors behind ${siteConfig.name}.`
};

export default function AuthorsIndexPage() {
  const authors = getAllAuthors();
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-navy dark:text-white">Authors</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/author/${author.slug}`}
            className="flex items-center gap-4 rounded-xl border border-gold/20 p-5 hover:shadow-md"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Image src={author.image} alt={author.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-semibold text-navy dark:text-white">{author.name}</h2>
              <p className="text-sm text-navy/60 dark:text-white/60">{author.role}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
