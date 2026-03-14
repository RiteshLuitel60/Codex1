import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0F",
        mist: "#A6ACBF",
        aurora: "#88C4FF"
      },
      boxShadow: {
        glass: "0 10px 45px rgba(10, 10, 15, 0.35)"
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at top right, rgba(136, 196, 255, .35), transparent 45%), radial-gradient(circle at left, rgba(121, 89, 255, .2), transparent 45%)"
      }
    }
  },
  plugins: []
};

export default config;
