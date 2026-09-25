/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0B0F0D',
          900: '#101512',
          800: '#17221C',
          700: '#203128',
          600: '#2C4136',
          500: '#3D5849',
        },
        warm: {
          50: '#FAF9F5',
          100: '#F5F1E8',
          200: '#E9E3D5',
          300: '#D8CFBC',
          400: '#C2B59D',
          card: '#151D18',
        },
        brand: {
          lime: '#7FAF6A',
          lightlime: '#A8C66C',
          amber: '#D6A85F',
          emerald: '#2E5B3D',
          forest: '#1E382B',
          glow: '#92C97E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'glow-lime': '0 0 25px -3px rgba(127, 175, 106, 0.25)',
        'glow-amber': '0 0 25px -3px rgba(214, 168, 95, 0.25)',
      }
    },
  },
  plugins: [],
}
