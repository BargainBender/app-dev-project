/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        "corporate-custom": {
          ...require("daisyui/src/theming/themes")["[data-theme=corporate]"],
          "primary": "#2b44b6",
          "primary-focus": "#1e43e6",
          "error": "#ef4444",
          "base-200": "#ededed",
          "base-300": "blue"
        }
      }
    ]
  }
}

