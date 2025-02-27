import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        title: ['var(--font-title)'],
        text: ['var(--font-text)'],
      },
    },
    screens: {
      mb: {'raw': '(hover: none)'},
      dsk: {'raw': '(hover: hover)'},
      sm: '400px',
      md: '708px',
      lg: '916px',
      xl: '916px',
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    base: false,
    themes: [
      {
        munichburners: {
          primary: "#ffd0ff",
          secondary: "#90ffff",
          accent: "#ffd760",
          neutral: "#f3ffff",
          "base-100": "#000000",
          info: "#41ffff",
          success: "#9affdc",
          warning: "#fff129",
          error: "#ffbab9",
          },
        },
      ],
  }
} satisfies Config;
