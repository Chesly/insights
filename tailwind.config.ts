import type { Config } from "tailwindcss";

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
  plugins: [require("@tailwindcss/typography")]
};

export default config;
