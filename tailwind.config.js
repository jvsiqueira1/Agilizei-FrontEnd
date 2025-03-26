/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        orange: '#DB4E1E',
        'light-orange': '#FF8C00',
        success: '#00BC00',
        warning: '#CBC400',
        alert: '#BB0003',
        gray: '#666666',
      },
    },
  },
  plugins: [],
}
