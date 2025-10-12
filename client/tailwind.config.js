/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spotify-inspired dark theme colors with white accent
        'spotify-black': '#000000',
        'spotify-dark': '#121212',
        'spotify-gray': '#181818',
        'spotify-light-gray': '#282828',
        'spotify-lighter-gray': '#3E3E3E',
        'spotify-green': '#FFFFFF',
        'spotify-green-hover': '#E0E0E0',
        'spotify-text': '#FFFFFF',
        'spotify-text-gray': '#B3B3B3',
        'spotify-text-subdued': '#6A6A6A',
        'spotify-blue': '#1DA1F2',
        'spotify-border': '#282828',

        // Legacy colors for backwards compatibility
        primary: '#FFFFFF',
        dark: '#121212',
        darker: '#000000',
        light: '#F7F9F9',
      },
      backgroundColor: {
        'hover-spotify': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-spotify': 'linear-gradient(180deg, #FFFFFF 0%, #121212 100%)',
      },
    },
  },
  plugins: [],
}
