/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fondo: "#E0F2FE", // celeste claro
        oscuro: "#1E293B", // gris oscuro
      },
    },
  },
  plugins: [],
};
