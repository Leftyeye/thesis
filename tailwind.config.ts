import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          yellow: "#FFE500",
          black: "#000000",
          white: "#FFFFFF",
          gray: "#F5F5F5",
        },
        slack: {
          sidebar: "#FFD700",
          panel: "#FEFCE8",
          active: "#FF6B9D",
          hover: "#FEF08A",
          border: "#000000",
          text: "#1a1a1a",
          muted: "#6b7280",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-xl": "8px 8px 0px 0px #000000",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
