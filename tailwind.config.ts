import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/linkfolio/dist/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B37E9A",
        secondary: "#A78CB3",
        "background-start": "#FFD3E6",
        "background-end": "#BDA0CB",
      },
      backgroundImage: ({ theme }) => ({
        "gradient-background": `linear-gradient(
          to bottom, 
          ${theme("colors.background-start")}, 
          ${theme("colors.background-end")}
        )`,
      }),
    },
  },
  plugins: [],
};

export default config;
