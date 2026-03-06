import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Marathon dark theme — deep blues, blacks, orange/amber accents
        accent: {
          DEFAULT: '#f97316', // orange-500
          amber: '#f59e0b',   // amber-500
        },
        surface: {
          DEFAULT: '#0f1117',
          card: '#161b27',
          border: '#1e2535',
          hover: '#1e2a3b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
