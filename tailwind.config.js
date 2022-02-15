module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  purge: {
    options: {
      safelist: [
        'md:grid-cols-1', 
        'md:grid-cols-2', 
        'md:grid-cols-3', 
        'md:grid-cols-4', 
        'md:grid-cols-5', 
      ],
    }
  },
  theme: {
    extend: {},
    screens: {
      dsk: {'raw': '(hover: hover)'},
      sm: '400px',
      md: '708px',
      lg: '916px',
      xl: '916px',
    },
  },
  plugins: [
    require('tailwindcss-container-bleed'),
  ],
}
