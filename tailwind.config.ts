import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9f4",
          100: "#d6f0e3",
          200: "#aee0c8",
          300: "#79caa6",
          400: "#46ad80",
          500: "#249065",
          600: "#177350",
          700: "#135c42",
          800: "#134a36",
          900: "#103d2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
