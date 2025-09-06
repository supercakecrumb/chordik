/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5AC8FA',
        secondary: '#FF8AB3',
        muted: '#8B9EB3',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}