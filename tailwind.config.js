/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', 'src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf6f0',
          100: '#f3ebe0',
          200: '#e8d7c2',
          300: '#d9bd9c',
          400: '#c79e74',
          500: '#b8845a',
          600: '#a06d4a',
          700: '#82553b',
          800: '#5f3f2c',
          900: '#3d2a1e',
        },
        cream: {
          50: '#fefcf9',
          100: '#fdf8f1',
          200: '#faf0e1',
          300: '#f5e6cd',
          400: '#ecd6b0',
          500: '#dfc193',
        },
        ink: {
          50: '#f7f5f2',
          100: '#e8e3dc',
          200: '#cfc7ba',
          300: '#a89e8c',
          400: '#7d7261',
          500: '#5c5345',
          600: '#474034',
          700: '#332e25',
          800: '#211d17',
          900: '#100e0b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(61,42,30,0.06), 0 1px 2px rgba(61,42,30,0.04)',
        cardHover: '0 10px 24px -8px rgba(61,42,30,0.16), 0 2px 6px rgba(61,42,30,0.06)',
        pop: '0 10px 30px -10px rgba(130,85,59,0.35)',
        tab: '0 -2px 12px rgba(61,42,30,0.06)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'slide-up': { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        'spin-3d': { '0%': { transform: 'rotateY(0deg)' }, '100%': { transform: 'rotateY(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'spin-3d': 'spin-3d 12s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
