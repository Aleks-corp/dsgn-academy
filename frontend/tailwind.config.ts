import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        helvetica: ["var(--font-helvetica)", "sans-serif"],
      },
      screens: {
        sm: "390px",
        md: "744px",
        tab: "502px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1440px",
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        hover: {
          DEFAULT: "var(--hover)",
          foreground: "var(--hover-foreground)",
        },
        btn: "var(---background-btn)",
        btnHover: "var(--background-btn-hover)",
      },
      boxShadow: {
        btn: "var(--box-shadow-btn)",
        input: "var(--box-shadow-input)",
        inputHover: "var(--box-shadow-input-hover)",
      },
    },
  },
};

export default config;
