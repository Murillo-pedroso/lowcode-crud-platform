export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: true, // garante reset e estilos base
  },
  plugins: [require("@tailwindcss/typography")],

};
