/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme (Primary)
        primary: '#D97706',        // Warm amber
        secondary: '#EA580C',      // Vibrant orange
        'background-light': '#F7F5F2',
        surface: '#FFFFFF',

        // Additional semantic colors
        'text-primary': '#1F2937',
        'text-muted': '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',

        // Dark Theme colors (for dark mode)
        'background-dark': '#1E1E1E',
        'surface-dark': '#2D2D2D',
        'primary-dark': '#CC785C',
        'secondary-dark': '#9B6B5C',
        'text-dark': '#E8E8E8',
        'text-muted-dark': '#A0A0A0',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        // Map semibold and extrabold to bold since we only load 400, 500, 700
        normal: '400',
        medium: '500',
        semibold: '700', // Maps to bold (was 600)
        bold: '700',
        extrabold: '700', // Maps to bold (was 800)
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
