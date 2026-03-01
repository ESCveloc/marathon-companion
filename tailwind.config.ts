import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marathon: {
          black: "#0a0a0f",
          dark: "#12121a",
          navy: "#1a1a2e",
          slate: "#252540",
          orange: "#e87d0d",
          amber: "#f5a623",
          gold: "#ffd700",
          red: "#e63946",
          green: "#2ecc71",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          muted: "#6b7280",
          text: "#e5e7eb",
          "text-dim": "#9ca3af",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
