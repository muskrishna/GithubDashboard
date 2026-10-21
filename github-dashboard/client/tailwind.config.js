/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#2457D6', dark: '#16398F', soft: '#EAF0FD' },
        ink: '#14171C',
        muted: '#5B6472',
        line: '#E3E6EB',
        surface: '#F6F7F9',
      },
    },
  },
  plugins: [],
};
