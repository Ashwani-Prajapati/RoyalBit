/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          dark: '#030712',
          navy: '#060d21',
          blue: '#0d1b3e',
          card: '#0a1636',
          cardBorder: '#1e3264',
          accent: '#00d2ff',
          neon: '#00f0ff',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
        }
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #050b1a 0%, #0a1738 50%, #030814 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(13, 27, 62, 0.85) 0%, rgba(7, 15, 36, 0.95) 100%)',
        'glow-gradient': 'radial-gradient(circle at 50% 0%, rgba(0, 210, 255, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-blue': '0 0 25px -5px rgba(0, 210, 255, 0.35)',
        'neon-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}

