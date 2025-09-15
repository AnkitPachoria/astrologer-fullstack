/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // scan all your source files
  theme: {
    extend: {
      colors: {
        maroon: {
          700: '#800000',
          900: '#4b0000',
        },
        cream: {
          100: '#f5f5dc',
          300: '#f0e6d2',
        },
        'yellow-400': '#facc15', // just example if default is not enough
      },
    },
  },
  plugins: [],
};
