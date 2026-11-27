/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./admin/pages/**/*.{js,jsx,ts,tsx}",
    "./admin/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        secondary: "#2c3e50",
        accent: "#e67e22"
      }
    }
  },
  plugins: []
};
