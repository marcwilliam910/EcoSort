/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: "Noto Serif",
      },
      colors: {
        primary: "#0076FF",
        secondary: "#0A0A0A",
        secondaryHover: "#2E7A62",
      },
    },
  },
  plugins: [],
};
