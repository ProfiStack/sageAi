/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./CustomComponents/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(243, 244, 246, 0.64) 0%, rgba(142, 169, 196, 0.46) 46.29%, rgba(247, 247, 248, 0.64) 100%)",
        "community-gradient":
          "linear-gradient(90deg, #014367 0%, #14315D 50%, #8EA9C4 100%)",
        "banner-gradient":
          "linear-gradient(180deg, rgba(243, 244, 246, 0.64) 10.71%, rgba(18, 64, 116, 0.38) 46.29%, rgba(247, 247, 248, 0.64) 100%)",
        "thankyou-gradient":
          "linear-gradient(180deg, rgba(142, 169, 196, 0.64) 74%, rgba(247, 247, 248, 0.64) 100%)",
        "bar-gradient":
          "linear-gradient(to right, rgba(52, 199, 89, 0.80), rgba(52, 199, 89, 0))",
        "blue-gradient":
          "linear-gradient(to bottom right, #4D8AA4, #6FA0B7, #B3C9D1)",
      },
      colors: {
        lightGreenGray: "rgba(238, 244, 237, 0.5)",
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
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
