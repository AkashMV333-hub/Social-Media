/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern vibrant gradient theme
        'primary': '#6366f1',
        'primary-dark': '#4f46e5',
        'secondary': '#ec4899',
        'accent': '#8b5cf6',
        'success': '#10b981',

        // Dark theme base
        'dark-900': '#0a0a0f',
        'dark-800': '#13131a',
        'dark-700': '#1a1a24',
        'dark-600': '#24243a',
        'dark-500': '#2d2d44',

        // Text colors
        'text-primary': '#f8fafc',
        'text-secondary': '#cbd5e1',
        'text-muted': '#94a3b8',
        'text-subtle': '#64748b',

        // Legacy compatibility
        'spotify-black': '#0a0a0f',
        'spotify-dark': '#13131a',
        'spotify-gray': '#1a1a24',
        'spotify-light-gray': '#24243a',
        'spotify-lighter-gray': '#2d2d44',
        'spotify-green': '#6366f1',
        'spotify-green-hover': '#4f46e5',
        'spotify-text': '#f8fafc',
        'spotify-text-gray': '#cbd5e1',
        'spotify-text-subdued': '#94a3b8',
        'spotify-border': '#24243a',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(180deg, #13131a 0%, #0a0a0f 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(99, 102, 241, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
