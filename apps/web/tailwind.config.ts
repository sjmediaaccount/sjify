import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#07090E',
        foreground: '#F1F5F9',
        canvas: {
          DEFAULT: '#07090E',
          subtle: '#0B0F17',
          card: '#101623',
          cardHover: '#161F31',
          border: '#1C2638',
          borderHover: '#2A3A54',
        },
        brand: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4', // Primary Cyan
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          glow: 'rgba(6, 182, 212, 0.25)',
        },
        accent: {
          teal: '#14B8A6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-sm': '0 0 15px -3px rgba(6, 182, 212, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-beam': 'border-beam 4s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
