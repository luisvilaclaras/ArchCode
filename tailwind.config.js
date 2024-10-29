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
        lightBlue: '#add8e6', // Reemplaza con el código de color que prefieras
        darkBlue: '#00008b'
      },
      fontFamily: {
        personalizada: ['MiFuentePersonalizada', 'sans-serif'], // Define el nombre de la fuente
      },
      screens: {
        'custom': '1480px',
      }
    },
  },
  plugins: [],
};
