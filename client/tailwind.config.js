/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        dark: '#15202B',
        darker: '#192734',
        light: '#F7F9F9',
      },
    },
  },
  plugins: [],
}
