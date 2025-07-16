/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#51b88c',
          50: '#e6f6f0',
          100: '#c3e9d8',
          200: '#9fdcc0',
          300: '#7bcfa8',
          400: '#57c290',
          500: '#51b88c',
          600: '#3e926e',
          700: '#2a6c50',
          800: '#174632',
          900: '#032014',
        },
        primary: {
          50: '#e6f6f0',
          100: '#c3e9d8',
          200: '#9fdcc0',
          300: '#7bcfa8',
          400: '#57c290',
          500: '#51b88c',
          600: '#3e926e',
          700: '#2a6c50',
          800: '#174632',
          900: '#032014',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'hebrew': ['Assistant', 'Rubik', 'system-ui', 'sans-serif'],
        'sans': ['Assistant', 'Rubik', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 