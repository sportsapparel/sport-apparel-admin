import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        btnColor: "#AD6343",
        btnHoverColor: "#5D6956",
        textColor: "#30362C",
        backgroundColor: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
export default config;
