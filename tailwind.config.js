/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bddaff',
          300: '#8abcff',
          400: '#569eff',
          500: '#3385ff',
          600: '#2570e3',
          700: '#1c5cbe',
          800: '#1a4a98',
          900: '#173d7a',
        },
        orange: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffdbad',
          300: '#ffc078',
          400: '#ff9636',
          500: '#ff7a00',
          600: '#e56100',
          700: '#c04c00',
          800: '#9a3e08',
          900: '#7c350f',
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(66, 153, 225, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-indigo-600'
  ]
}