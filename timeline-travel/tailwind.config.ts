import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#0F3D3E" },
        gold: { DEFAULT: "#D9A62E" },
      },
    },
  },
  plugins: [typography],
};

export default config;
