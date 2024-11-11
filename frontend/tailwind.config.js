/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      width: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      colors: {
        'custom-blue': 'rgb(13, 170, 191)'
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scroll-hidden': {
          'overflow-y': 'scroll',
          'scrollbar-width': 'none', /* Ẩn thanh cuộn trong Firefox */
        },
        '.scroll-hidden::-webkit-scrollbar': {
          'width': '0px', /* Ẩn thanh cuộn trong các trình duyệt dựa trên WebKit */
        },
      }, ['responsive']);
    },
  ],
}
