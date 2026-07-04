import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#8B6914",
          light: "#B8935A",
          dark: "#5C4510"
        },
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2E4270",
          dark: "#0F1A30"
        },
        // v2 refinement palette — keep in sync with lib/siteConfig.ts branding.colors
        utility: {
          bg: "#1a1c21",
          text: "#4c525e"
        },
        section: "#2e333d",
        footer: {
          DEFAULT: "#1a1c21",
          copyright: "#030303"
        }
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-links": "#8B6914",
            "--tw-prose-bold": "#1B2A4A"
          }
        }
      })
    }
  },
  plugins: [typography]
};

export default config;
