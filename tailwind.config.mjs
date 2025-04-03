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
        geist: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        montserrat: ["var(--font-montserrat)"],
      },
    },
  },
  plugins: [],
};

export default config;
