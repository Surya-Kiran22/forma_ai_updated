/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Premium dark surface scale (deep green-black)
        ink: {
          950: '#050806',
          900: '#0a100d',
          800: '#0f1813',
          700: '#15221b',
          600: '#1d3026',
          500: '#2a4437',
        },
        // Warm cream text scale
        cream: {
          50: '#f7f4ec',
          100: '#efeadd',
          200: '#d9d3c3',
          300: '#b9b3a3',
          400: '#8f8a7c',
        },
        // Emerald accent
        emerald: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Champagne gold highlight
        gold: {
          300: '#ecd3a3',
          400: '#d9b77e',
          500: '#c39a55',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(52, 211, 153, 0.45)',
        'glow-sm': '0 0 20px -6px rgba(52, 211, 153, 0.5)',
        panel: '0 20px 50px -20px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 5s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
