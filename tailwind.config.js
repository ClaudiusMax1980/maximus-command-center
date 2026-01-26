export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maximus: {
          bg: '#0a0a0a',
          card: '#111111',
          text: '#e5e5e5',
          accent: '#ef4444', // Red for aggressive/active
          shield: '#3b82f6', // Blue for shield
          success: '#22c55e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}