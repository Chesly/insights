import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";
export const alt = "Article cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title || siteConfig.name;
  const category = post?.category || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1B2A4A",
          padding: "64px",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#8B6914"
            }}
          />
          <span style={{ color: "#8B6914", fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
            {siteConfig.shortName.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category && (
            <span
              style={{
                color: "#8B6914",
                fontSize: 24,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >
              {category}
            </span>
          )}
          <span
            style={{
              color: "#ffffff",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 1000
            }}
          >
            {title}
          </span>
        </div>

        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 22 }}>
          {siteConfig.url.replace("https://", "")}
        </span>
      </div>
    ),
    { ...size }
  );
}
