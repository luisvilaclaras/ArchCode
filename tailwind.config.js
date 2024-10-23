/** @type {import('tailwindcss').Config} */
module.exports = {
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
        darkBlue: '#1e3a8a',
        lightBlue: '#60a5fa',
      },
      fontFamily: {
        personalizada: ['MiFuentePersonalizada', 'sans-serif'],
      },
      screens: {
        'custom': '1480px',
      }
    },
  },
  plugins: [],
};
