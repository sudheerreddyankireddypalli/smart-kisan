/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#030712', // deep void black
          secondary: '#070d1e', // midnight navy
          tertiary: '#0c152e',
          card: 'rgba(12, 21, 46, 0.65)',
        },
        brand: {
          purple: {
            light: '#c084fc',
            DEFAULT: '#a855f7',
            dark: '#7e22ce',
            glow: '#9333ea',
          },
          cyan: {
            light: '#67e8f9',
            DEFAULT: '#06b6d4',
            dark: '#0e7490',
            glow: '#00f2fe',
          },
          emerald: {
            light: '#6ee7b7',
            DEFAULT: '#10b981',
            dark: '#047857',
          },
          blue: {
            light: '#60a5fa',
            DEFAULT: '#3b82f6',
            dark: '#1d4ed8',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-mixed': '0 0 35px -5px rgba(168, 85, 247, 0.3), 0 0 20px -5px rgba(6, 182, 212, 0.25)',
        'card-3d': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-very-slow': 'spin 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
