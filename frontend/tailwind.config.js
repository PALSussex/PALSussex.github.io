/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {

    fontSize: {
      "xxs": "0.4rem",
      'sm': '0.8rem',
      'base': '1rem',
      'xl': '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    extend: {
      width: {
        '200per': '200%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
