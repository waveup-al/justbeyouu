/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0b0b14',
        'neon-cyan': '#4ee1ff',
        'neon-purple': '#7b61ff',
        'warm-amber': '#f2a900',
        'teal-accent': '#1fb6b3',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Space Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 600ms infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'strum': 'strum 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        strum: {
          '0%, 90%, 100%': { transform: 'rotate(0deg)' },
          '5%': { transform: 'rotate(-2deg)' },
          '10%': { transform: 'rotate(2deg)' },
          '15%': { transform: 'rotate(-1deg)' },
          '20%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'glass': '8px',
      },
    },
  },
  plugins: [],
}