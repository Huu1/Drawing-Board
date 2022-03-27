const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        secondary: '#343a40',
        dark: '#1b1e21',
        gray: '#6c757d'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
