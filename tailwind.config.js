/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          50:  '#f4f6f0',
          100: '#e3e9d9',
          200: '#c8d4b5',
          300: '#a4b888',
          400: '#7d9b5e',
          500: '#5f7d3f',
          600: '#4a6330',
          700: '#3b4f27',
          800: '#2f3f20',
          900: '#1e2814',
          950: '#111709',
        },
        olive: {
          500: '#6b7c4e',
          600: '#556040',
          700: '#404a30',
          800: '#2c3320',
          900: '#1a2014',
        },
        khaki: {
          100: '#f5f0e8',
          200: '#e8dcca',
          300: '#d4c4a0',
          400: '#c3b091',
          500: '#b09a78',
          600: '#9a8263',
        },
        gold: {
          400: '#e8c84a',
          500: '#d4af37',
          600: '#b8952a',
        },
        military: {
          dark: '#0d1207',
          darker: '#070c03',
        }
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'camo-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%232f3f20'/%3E%3Cellipse cx='20' cy='20' rx='15' ry='10' fill='%23232e17' opacity='0.6'/%3E%3Cellipse cx='60' cy='15' rx='20' ry='12' fill='%231a2014' opacity='0.5'/%3E%3Cellipse cx='80' cy='55' rx='12' ry='18' fill='%23232e17' opacity='0.6'/%3E%3Cellipse cx='30' cy='70' rx='18' ry='10' fill='%231a2014' opacity='0.4'/%3E%3Cellipse cx='70' cy='85' rx='15' ry='8' fill='%23232e17' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
