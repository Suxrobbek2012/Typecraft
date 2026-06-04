import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        // Dark theme
        dark: {
          bg:      '#0E0E10',
          surface: '#18181B',
          card:    '#1F1F23',
          border:  '#2A2A2E',
          muted:   '#3A3A40',
        },
        // Light theme
        light: {
          bg:      '#F4F1EB',
          surface: '#FAFAF8',
          card:    '#FFFFFF',
          border:  '#E5E2DC',
          muted:   '#C8C5BE',
        },
        // Accent - amber/gold typing theme
        accent: {
          DEFAULT: '#E8B84B',
          light:   '#F5CC6E',
          dark:    '#C99B2E',
          glow:    'rgba(232, 184, 75, 0.15)',
        },
        // Status colors
        correct:  '#4ADE80',
        wrong:    '#F87171',
        cursor:   '#E8B84B',
      },
      animation: {
        'cursor-blink': 'blink 1s ease-in-out infinite',
        'fade-in':      'fadeIn 0.3s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(232,184,75,0.2)' },
          '50%':      { boxShadow: '0 0 30px rgba(232,184,75,0.5)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
