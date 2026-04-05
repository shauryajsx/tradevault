/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#d97757',
          hover: '#c4623f',
          bg: 'rgba(217,119,87,0.12)',
        },
        dark: {
          0: '#080c14',
          1: '#0e1420',
          2: '#141c2b',
          3: '#1a2437',
          4: '#212d43',
        },
        border: {
          DEFAULT: '#1e2d42',
          light: '#2a3a52',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
