/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        win11: {
          bg: "#202020",
          surface: "#2d2d2d",
          display: "#1f1f1f",
          hover: "#3a3a3a",
          active: "#4a4a4a",
          text: "#ffffff",
          textSecondary: "#a0a0a0",
          accent: "#60cdff",
          accentHover: "#4db8e8",
          operator: "#242424",
          operatorHover: "#2f2f2f",
          equals: "#0078d4",
          equalsHover: "#106ebe",
        },
      },
      fontFamily: {
        segoe: ["Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
