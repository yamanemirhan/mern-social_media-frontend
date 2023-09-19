/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-navbar": "#101010",
        "black-main": "#171717",
        "white-main": "#B9B9B9",
        dropdown: "#2B2B2B",
      },
      fontFamily: {
        kulimpark: ["kulimpark", "sans-serif"],
      },
    },
  },
  plugins: [],
};
