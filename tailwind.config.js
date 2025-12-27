/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // LiveChat signature colors
        'lc-orange': {
          DEFAULT: '#FF5100',
          hover: '#E64900',
          light: '#FFF4F0',
        },
        'lc-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E0E0E0',
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#767676',
          600: '#5C5C5C',
          700: '#424242',
          800: '#2D2D2D',
          900: '#1B1B1B',
        },
        'lc-green': '#4CAF50',
        'lc-yellow': '#FFC107',
        'lc-red': '#F44336',
        'lc-blue': '#2196F3',
        'lc-dark': {
          bg: '#1E1E1E',
          surface: '#2D2D2D',
          border: '#424242',
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      keyframes: {
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        typingDot: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
          },
          '30%': {
            transform: 'translateY(-4px)',
          },
        },
        slideIn: {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        fadeInUp: 'fadeInUp 0.2s ease-out',
        typingDot: 'typingDot 1.4s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
