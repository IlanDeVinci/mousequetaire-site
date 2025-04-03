import { Montserrat } from "next/font/google";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Montserrat: ["var(--font-montserrat)"],
        MontserratBold: ["var(--font-montserrat-bold)"],
        MontserratLight: ["var(--font-montserrat-light)"],
        MontserratMedium: ["var(--font-montserrat-medium)"],
        MontserratRegular: ["var(--font-montserrat-regular)"],
        MontserratSemiBold: ["var(--font-montserrat-semibold)"],
        MontserratThin: ["var(--font-montserrat-thin)"],
      },
    },
  },
  plugins: [],
};

export default config;
