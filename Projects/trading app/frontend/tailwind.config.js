/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        'card-hover': '#1F2937',
        border: '#1E293B',
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        profit: {
          DEFAULT: '#10B981', // emerald-500
          dark: '#059669',
          light: '#34D399',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        loss: {
          DEFAULT: '#F43F5E', // rose-500
          dark: '#E11D48',
          light: '#FB7185',
          bg: 'rgba(244, 63, 94, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
