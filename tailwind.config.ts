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
  safelist: [
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'md:grid-cols-5',
    'md:grid-cols-6',
    'bg-blue-800',
    'bg-purple-800',
    'bg-red-800',
    'bg-green-800',
    'bg-cyan-600',
    'bg-lime-600',
    'bg-green-500',
  ],
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
