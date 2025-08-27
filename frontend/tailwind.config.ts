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
        tabx: "630px",
        lg: "1024px",
        xl: "1200px",
        xxl: "1440px",
        "2xl": "1560px",
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
          background: "var(--muted-background)",
          text: "var(--muted-text)",
        },
        text: {
          DEFAULT: "var(--text-grey)",
          white: "var(--text-white)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        hover: {
          DEFAULT: "var(--hover)",
          foreground: "var(--hover-foreground)",
        },
        btn: {
          DEFAULT: "var(---background-btn)",
          hover: "var(--background-btn-hover)",
        },
        icon: {
          DEFAULT: "var(--icon-bg)",
          foreground: "var(--icon-foreground)",
        },
        border: {
          DEFAULT: "var(--border-bg)",
          foreground: "var(--border-foreground)",
          focus: "var(--border-bg-focus)",
        },
      },
      letterSpacing: {
        thin: "-0.01em",
        thiner: "-0.02em",
        thinest: "-0.03em",
      },

      boxShadow: {
        btn: "var(--box-shadow-btn)",
        input: {
          DEFAULT: "var(--box-shadow-input)",
          hover: "var(--box-shadow-input-hover)",
        },
        icon: "var(--box-shadow-icon)",
        count: "var(--box-shadow-count)",
        sub: "var(--box-shadow-sub)",
        switch: {
          box: "var(--box-shadow-switch-box)",
          btn: "var(--box-shadow-switch-btn)",
        },
        card: {
          video: "var(--box-shadow-video-card)",
        },
        btns: { scroll: "var(--box-shadow-btn-scroll)" },
        select: "var(--box-shadow-select)",
      },
    },
  },
};

export default config;
