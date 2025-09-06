/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base dark palette
        base: {
          900: '#0b0f13',  // page bg
          800: '#11161d',  // app shell
          700: '#161c24',  // cards
          600: '#1c232e',  // inputs/secondary
          500: '#222b37'   // elevated
        },
        // Trans-flag accents (accessible on dark)
        trans: {
          blue:  '#5AC8FA', // primary
          pink:  '#FF8AB3', // secondary
          white: '#E7EEF6'  // light text/lines
        },
        ink: {
          100: '#B5C5D6',
          200: '#9FB1C6',
          300: '#8AA0B7',
          400: '#7690A9',
          500: '#63819C'   // muted text
        },
        success: '#4DD4B0',
        danger:  '#FF5C70',
        warn:    '#FFB65C',
        primary: '#5AC8FA',
        secondary: '#FF8AB3',
        muted: '#8B9EB3',
      },
      borderRadius: {
        'xl': '1rem',
        'xl2': '1.25rem' // card radius
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)',
        ring: '0 0 0 2px rgba(90,200,250,0.35)'
      },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace']
      },
      letterSpacing: {
        tight2: '-0.01em'
      },
      // Typography for chord sheets
      lineHeight: {
        snugger: '1.2',   // global tighter
        chord: '1.05'     // chord row height
      }
    },
  },
  plugins: [],
}