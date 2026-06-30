/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D1117',
        panel: '#161B22',
        border: '#30363D',
        purple: '#7C3AED',
        'purple-dim': '#5B21B6',
        blue: '#58A6FF',
        green: '#3FB950',
        amber: '#D29922',
        red: '#F85149',
        ink: {
          DEFAULT: '#E6EDF3',
          muted: '#8B949E',
          faint: '#484F58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 4px #7C3AED55' },
          to: { boxShadow: '0 0 16px #7C3AEDaa, 0 0 4px #7C3AED' },
        },
      },
      boxShadow: {
        'panel': '0 1px 3px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
