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
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#2F5D62",
        secondary: "#5E8B7E",
        "background-start": "#2F5D62",
        "background-end": "#A7C4BC",
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
