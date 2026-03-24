/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  corePlugins: {
    preflight: false, // Prevent conflicts with Ant Design base styles
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
