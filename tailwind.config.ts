import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#05070c',
        mist: '#f5f7ff',
        aurora: {
          1: '#8d7bff',
          2: '#4fb4ff',
          3: '#64ffc2'
        }
      },
      boxShadow: {
        glass: '0 10px 40px rgba(0,0,0,0.28)'
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(141,123,255,0.18), transparent 38%), radial-gradient(circle at 80% 30%, rgba(79,180,255,0.16), transparent 34%), radial-gradient(circle at 50% 80%, rgba(100,255,194,0.10), transparent 45%)'
      }
    }
  },
  plugins: []
};

export default config;
