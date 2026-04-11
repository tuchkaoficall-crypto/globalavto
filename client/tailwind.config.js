/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#0D0D0D',
        'brand-red': '#E60023',
        'brand-red-hover': '#CC001F',
        'brand-gray': '#6B7280',
        'brand-card': 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
