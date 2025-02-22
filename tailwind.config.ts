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
  plugins: [],
} satisfies Config;
