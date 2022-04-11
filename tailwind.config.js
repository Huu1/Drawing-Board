const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#404854',
        secondary: 'rgb(232, 232, 232)'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
