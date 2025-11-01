import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neopets-inspired vibrant color palette
        neopets: {
          blue: '#4A90E2',
          lightBlue: '#7BB3F0',
          pink: '#FF6B9D',
          lightPink: '#FFB3D1',
          yellow: '#FFD93D',
          lightYellow: '#FFE66D',
          green: '#6BCF7F',
          lightGreen: '#9FE5B4',
          purple: '#A78BFA',
          lightPurple: '#C4B5FD',
          orange: '#FF8B61',
          lightOrange: '#FFB896',
        },
        // Keep some standard colors for text/backgrounds
      },
      fontFamily: {
        comic: ['Comic Sans MS', 'cursive', 'sans-serif'],
        rounded: ['Nunito', 'Varela Round', 'Arial Rounded MT Bold', 'sans-serif'],
      },
      borderRadius: {
        bubble: '20px',
        big: '30px',
      },
      boxShadow: {
        neopets: '0 4px 14px 0 rgba(74, 144, 226, 0.39)',
        'neopets-lg': '0 8px 24px 0 rgba(74, 144, 226, 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
