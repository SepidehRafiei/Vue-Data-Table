const tailwindcssRtl = require('tailwindcss-rtl');

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        vazirmatn: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssRtl],
}