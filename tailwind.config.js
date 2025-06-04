module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00aae7',
        secondary: '#0046B0',
        accent: '#003994',
        'green-600': '#059669',
        'green-700': '#047857',
        'green-50': '#f0fdf4',
        'green-500': '#10b981',
        // Medical theme colors
        'medical-primary': '#4CAF82',
        'medical-secondary': '#34767A',
        'medical-accent': '#E3657C',
        'medical-light': '#F0F4F8',
        'medical-text': '#2D4A58',
        'medical-error': '#FF4D4F',
      },
      spacing: {
        '14': '3.5rem',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
