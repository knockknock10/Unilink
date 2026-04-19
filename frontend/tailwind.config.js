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
        // UniLink brand palette
        background: "#E87F24", // orange
        secondary: "#D96F17", // darker orange for navbar/sections
        primary: "#FEFDDF", // light cream text on orange
        accent: "#73A5CA", // blue
        button: "#FFC81E", // yellow
        surface: "#FEFDDF", // light card/input surface
        ink: "#111827", // readable dark text on surface
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
