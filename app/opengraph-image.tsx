import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

export const runtime = "nodejs";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B2A4A",
          fontFamily: "sans-serif"
        }}
      >
        <span style={{ color: "#8B6914", fontSize: 34, letterSpacing: 4, fontWeight: 700 }}>
          {siteConfig.shortName.toUpperCase()}
        </span>
        <span
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontWeight: 700,
            marginTop: 24,
            textAlign: "center",
            maxWidth: 900
          }}
        >
          AI, Technology &amp; SEO Insights from South Africa
        </span>
      </div>
    ),
    { ...size }
  );
}
