/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        primary: {
          DEFAULT: '#14746f',
          dark: '#0f5750',
        }
      }
    },
  },
  plugins: [],
}
