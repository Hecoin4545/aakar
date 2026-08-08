/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F3E9',
          alt: '#EFEAE0',
          white: '#FFFFFF',
        },
        brown: {
          darkest: '#2C2015',
          heading: '#3A2A1C',
        },
        slate: {
          body: '#4A5A78',
          muted: '#8A8478',
        },
        gold: {
          accent: '#B4863A',
          light: '#C9A45C',
        },
        customBorder: '#E3DDCE',
        status: {
          success: '#5B7A4F',
          warning: '#C07A2E',
          neutral: '#8A8478',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(44, 32, 21, 0.08)',
        'glass': '0 8px 32px 0 rgba(44, 32, 21, 0.06)',
      }
    },
  },
  plugins: [],
}
