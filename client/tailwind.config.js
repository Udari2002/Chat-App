/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom colors for your chat app
      colors: {
        primary: {
          50: '#f3f2ff',
          100: '#e9e7ff',
          200: '#d5d2ff',
          300: '#b8b0ff',
          400: '#9b8bff',
          500: '#8185B2', // Your main color
          600: '#6b5caa',
          700: '#5a4d96',
          800: '#4a3f7c',
          900: '#3d3464',
        },
        chat: {
          bg: '#282142',      // Chat background
          surface: '#1e1a35', // Card/surface color
          border: '#374151',  // Border color
          text: {
            primary: '#ffffff',
            secondary: '#d1d5db',
            muted: '#9ca3af',
          }
        }
      },
      
      // Custom font family
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      
      // Custom font weights
      fontWeight: {
        'outfit-light': '100',
        'outfit-regular': '400',
        'outfit-bold': '700',
        'outfit-black': '900',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        'xs': '2px',
        'xl': '20px',
        '2xl': '40px',
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Custom spacing for chat layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '104': '26rem',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Custom box shadows
      boxShadow: {
        'chat': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'message': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(129, 133, 178, 0.3)',
      },
    },
  },
  plugins: [],
}

