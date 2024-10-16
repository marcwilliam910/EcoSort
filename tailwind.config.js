/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        loading: {
          "0%": {width: "0%"},
          "50%": {width: "90%"},
          "100%": {width: "0%"},
        },
      },
      animation: {
        loading: "loading 1.5s ease-in-out infinite",
      },
      fontFamily: {
        title: "Noto Serif",
      },
      boxShadow: {
        glow: "0px 0px 74px 0px rgba(255,255,255,0.75)",
      },
      colors: {
        light: {
          primary: "#3B8230",
          primaryHover: "#EBECF0",
          primaryFocusBG: "#34d399",
          background: "#E0E0E0",
          text: "#23272F",
          card: "#F9F9F9",
          border: "#E2E8F0",
        },
        // Dark mode palette
        dark: {
          primary: "#4ACA3A", // A brighter green to contrast with the dark background
          primaryHover: "#343B47", // Your original primary color, now used for hover
          primaryFocusBG: "#34d399", // Kept the same as your light mode
          background: "#23272F", // The dark mode background color you provided
          text: "#E1E5EA", // Light gray for better readability on dark background
          card: "#2C3138", // Slightly lighter than the background for cards
          border: "#3A3F4A", // Darker border color for subtle separation
        },
        darkMode: "class",

        // shadcn
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        secondaryHover: "#2E7A62",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      height: {
        dvh: "100dvh",
      },
      gridTemplateColumns: {
        tableDefault: "1fr 1fr 1fr 1.5fr .75fr",
        4: "1.25fr 1.5fr 1fr 1fr",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
