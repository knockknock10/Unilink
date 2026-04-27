/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // UniLink Premium Orange Palette
        primary: "#E87F24",      // Vibrant Orange
        accent: "#FFC81E",       // Sunny Yellow
        background: "#FEF6EE",   // Soft Cream
        surface: "#FFFFFF",      // Clean White
        ink: "#2D2D2D",          // Deep Graphite
        muted: "#6B7280",        // Steel Gray
        border: "#F1E4D7",       // Sand Border
        button: "#E87F24",       // Primary Action
        secondary: "#FFC81E",    // Secondary Action
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
