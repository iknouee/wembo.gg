import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1280px' } },
    extend: {
      maxWidth: { 'content': '1200px' },
      colors: {
        border: 'rgba(255,255,255,0.07)',
        background: '#050505',
        foreground: '#F7F7F8',
        primary: { DEFAULT: '#FFD600', foreground: '#0a0a0a' },
        secondary: { DEFAULT: '#090A0C', foreground: '#F7F7F8' },
        muted: { DEFAULT: '#0D0E11', foreground: '#9A9CA3' },
        card: { DEFAULT: '#0D0E11', foreground: '#F7F7F8' },
        accent: { DEFAULT: '#141519', foreground: '#F7F7F8' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      borderRadius: { lg: '0.625rem', md: '0.5rem', sm: '0.375rem' },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-down': 'fade-down 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-slow-2': 'float-slow-2 7s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'glow-breathe': 'glow-breathe 5s ease-in-out infinite',
        'count-up': 'count-up-anim 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'grid-pulse': 'grid-pulse 8s ease-in-out infinite',
        'shimmer': 'btn-shimmer-move 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
