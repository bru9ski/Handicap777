/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFD700',
          500: '#FFC107',
          600: '#FFB300',
        },
        dark: {
          900: '#0A0A0B',
          800: '#111113',
          700: '#18181B',
          600: '#1E1E22',
          500: '#27272B',
          400: '#323236',
          300: '#3F3F44',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.4s ease-in forwards',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
