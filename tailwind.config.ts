import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-serif)', 'ui-serif', 'Georgia', 'serif']
      },
      colors: {
        midnight: '#0b111b',
        mist: '#f6f2ea',
        stonewash: '#ded6c8',
        brass: '#b07b34',
        lagoon: '#0f766e',
        ember: '#a6361d',
        ink: '#1a2433'
      },
      boxShadow: {
        glass: '0 18px 50px rgba(9, 14, 20, 0.18)',
        bloom: '0 12px 36px rgba(176, 123, 52, 0.22)'
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 14% 16%, rgba(176,123,52,0.28), transparent 40%), radial-gradient(circle at 82% 20%, rgba(15,118,110,0.25), transparent 34%), radial-gradient(circle at 45% 86%, rgba(166,54,29,0.18), transparent 46%)',
        'mesh-gradient':
          'linear-gradient(145deg, rgba(246,242,234,0.84) 0%, rgba(236,228,214,0.7) 38%, rgba(225,241,236,0.66) 100%)'
      }
    }
  },
  plugins: []
};

export default config;
