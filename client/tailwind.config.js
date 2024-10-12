module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#1a1a1a',
        'custom-text': '#ffffff',
        'custom-subtitle': '#f8f9fa',
        'custom-description': '#adb5bd',
        'custom-button': '#4ecdc4',
        'custom-button-hover': '#45b7aa',
      },
    },
  },
  plugins: [],
}