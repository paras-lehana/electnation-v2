import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF6EC',
          100: '#FFE7CC',
          200: '#FFD09A',
          300: '#FFB866',
          400: '#FFA03D',
          500: '#A3520E',
          600: '#8B460C',
          700: '#703606',
          800: '#5E2F07',
          900: '#3F1F05',
        },
        leaf: {
          50: '#ECFBEC',
          100: '#CFF3CE',
          200: '#A4E4A2',
          300: '#6ED16A',
          400: '#38B836',
          500: '#138808',
          600: '#0E6E06',
          700: '#0A5604',
          800: '#073E03',
          900: '#042601',
        },
        'indigo-chakra': {
          DEFAULT: '#1E3A8A',
          100: '#DDE3F4',
          500: '#1E3A8A',
          700: '#142666',
        },
        khadi: {
          50: '#FBF6EE',
          100: '#F4ECDB',
          200: '#E8D9B8',
          300: '#D7BF8B',
          400: '#B79A66',
        },
        marigold: {
          400: '#FFC049',
          500: '#F6A623',
          600: '#D08508',
        },
        henna: {
          500: '#7B1E3A',
          700: '#561127',
        },
        ink: {
          50: '#F7F7F8',
          100: '#ECECEF',
          300: '#B8B8C2',
          500: '#6C6C78',
          700: '#3A3A43',
          900: '#14141A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        devanagari: ['var(--font-devanagari)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        khadi: '0 10px 30px -12px rgba(139, 70, 12, 0.25)',
        diya: '0 0 40px rgba(255, 153, 51, 0.35)',
      },
      keyframes: {
        'chakra-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'diya-flicker': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'marigold-drift': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.8' },
          '100%': { transform: 'translateY(-120vh) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        'chakra-spin': 'chakra-spin 18s linear infinite',
        'diya-flicker': 'diya-flicker 2.4s ease-in-out infinite',
        'marigold-drift': 'marigold-drift 14s linear infinite',
      },
      backgroundImage: {
        'tricolor-soft':
          'linear-gradient(180deg, rgba(255,153,51,0.10) 0%, rgba(255,255,255,0) 40%, rgba(19,136,8,0.08) 100%)',
        'rangoli-radial':
          'radial-gradient(circle at 50% 50%, rgba(246,166,35,0.22) 0%, rgba(246,166,35,0) 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
