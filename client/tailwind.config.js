module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'event': "url('./assets/background-4.jpeg')"
      },
      fontFamily: {'base':['Open Sans'], 'logo': ['Pacifico']}
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
