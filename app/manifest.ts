import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: new URL(siteConfig.url).pathname || "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: siteConfig.branding.colors.secondary,
    icons: [
      { src: siteConfig.branding.favicon, sizes: "512x512", type: "image/png" },
      { src: siteConfig.branding.favicon, sizes: "192x192", type: "image/png" }
    ]
  };
}
