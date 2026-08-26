import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#070809',
        foreground: '#F7F7F7',
        primary: { DEFAULT: '#FFD400', foreground: '#0a0a0a' },
        secondary: { DEFAULT: '#101114', foreground: '#F7F7F7' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: '#F7F7F7' },
        muted: { DEFAULT: '#101114', foreground: '#8B8D93' },
        accent: { DEFAULT: '#141519', foreground: '#F7F7F7' },
        popover: { DEFAULT: '#101114', foreground: '#F7F7F7' },
        card: { DEFAULT: '#101114', foreground: '#F7F7F7' },
      },
      borderRadius: { lg: '0.5rem', md: '0.375rem', sm: '0.25rem' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-down': 'fade-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        'count-up': 'count-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-breathe': 'glow-breathe 4s ease-in-out infinite',
        'grid-fade': 'grid-fade 8s ease-in-out infinite',
        'shimmer-slide': 'shimmer-slide 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
