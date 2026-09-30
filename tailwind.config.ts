import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0B0B', soft: '#1C1916' },
        brand: { DEFAULT: '#5A4A3A', dark: '#43372B', light: '#7D6B4A' },
        cream: { DEFAULT: '#FAF8F2', dark: '#F3EEE3' },
        sand: '#EFE7D8',
        line: '#E8E1D4',
        // DEFAULT is slightly deeper than the reference site's #9A7B18 so small
        // labels meet WCAG AA contrast (4.5:1) on white and cream.
        gold: { DEFAULT: '#86690F', light: '#C9A961', soft: '#EADBB0' },
        // The logo's gold: deep on light backgrounds, champagne on dark ones.
        logo: { DEFAULT: '#9A7536', light: '#E3C38A' },
        navy: '#141B34',
        muted: '#6F665C',
        success: '#15803D',
        danger: '#B42318',
      },
      fontFamily: {
        sans: ['var(--font-urbanist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        logo: ['var(--font-cinzel)', 'Georgia', 'serif'],
        script: ['var(--font-pinyon)', 'cursive'],
      },
      boxShadow: {
        card: '0 18px 40px -22px rgba(43, 33, 24, 0.35)',
        soft: '0 2px 14px rgba(20, 16, 12, 0.07)',
        header: '0 1px 0 rgba(20, 16, 12, 0.06), 0 8px 24px -16px rgba(20, 16, 12, 0.25)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
