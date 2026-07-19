"use client";

import { useState } from "react";
import type { PublicComment } from "@/lib/comments";

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: PublicComment[];
}) {
  const [comments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real visitors never touch this
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/public/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, email, content, website }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName(""); setEmail(""); setContent("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <h2 className="text-2xl font-bold text-navy dark:text-white">
        {comments.length > 0 ? `${comments.length} Comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </h2>

      {comments.length > 0 && (
        <div className="mt-6 space-y-6">
          {comments.map((c) => (
            <div key={c.id} className={c.parentId ? "ml-8 border-l-2 border-gold/20 pl-4" : ""}>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-navy dark:text-white">{c.authorName}</span>
                <span className="text-xs text-navy/40 dark:text-white/40">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy/70 dark:text-white/70 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 border-t border-gold/10 pt-8">
        <p className="text-sm font-semibold text-navy dark:text-white mb-4">Leave a comment</p>

        {status === "sent" ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 p-4">
            Thanks — your comment has been submitted and is awaiting approval.
          </p>
        ) : (
          <>
            {/* Honeypot — hidden from real visitors via CSS, bots fill it anyway */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              aria-hidden="true"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                required
                type="email"
                placeholder="Your email (not published)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Share your thoughts…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={3000}
              className="mt-3 w-full border border-gold/20 px-3 py-2 text-sm outline-none focus:border-gold"
            />
            {status === "error" && (
              <p className="mt-2 text-sm text-red-600">Something went wrong — please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-3 bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit Comment"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
