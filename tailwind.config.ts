import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1280px' } },
    extend: {
      maxWidth: { 'content': '1200px', 'dash': '1100px' },
      colors: {
        border: 'rgba(255,255,255,0.06)',
        'border-hover': 'rgba(255,255,255,0.11)',
        background: '#070708',
        foreground: '#F7F7F8',
        primary: { DEFAULT: '#FFD600', foreground: '#0a0a0a' },
        secondary: { DEFAULT: '#090A0C', foreground: '#F7F7F8' },
        muted: { DEFAULT: '#0D0E10', foreground: '#9A9CA3' },
        card: { DEFAULT: '#0D0E10', foreground: '#F7F7F8' },
        accent: { DEFAULT: '#111214', foreground: '#F7F7F8' },
        surface: {
          '0': '#070708',
          '1': '#090A0C',
          '2': '#0D0E10',
          '3': '#111214',
          '4': '#161719',
        },
        wembo: {
          yellow: '#FFD600',
          green: '#4ade80',
          red: '#f87171',
          purple: '#a78bfa',
          blue: '#60a5fa',
          orange: '#fb923c',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      fontSize: {
        'heading': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'body-sm': ['13px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4' }],
        'micro': ['11px', { lineHeight: '1.3' }],
        'stat': ['28px', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      borderRadius: { lg: '0.625rem', md: '0.5rem', sm: '0.375rem', xl: '0.75rem', '2xl': '1rem', '3xl': '1.25rem' },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        'sidebar': '260px',
      },
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
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)',
        'progress': 'progress-fill 1s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'progress-fill': {
          from: { width: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
