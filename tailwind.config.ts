import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "400px",
      sm: "600px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        navy: {
          950: "#060F1D",
          900: "#0B1F3A", // Core brand navy
          800: "#132D52",
          700: "#1C3E6E",
          600: "#27528E",
          100: "#E3EAF3",
        },
        cricket: {
          orange: "#F58220", // Vivid IPL orange accent
          "orange-hover": "#E06F12",
          "orange-light": "rgba(245, 130, 32, 0.15)",
          gold: "#F7C948", // Gold trophy highlight
          "gold-light": "rgba(247, 201, 72, 0.15)",
          green: "#10B981", // Success indicator
          red: "#EF4444", // Warning indicator
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
