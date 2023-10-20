import type { Config } from 'tailwindcss'

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  important: '#app',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'default': '#ffffff',
        'accent': '#fafafa',
        'dark': '#0f0e46',
        'light': '#F4FBFF',
      },
      textColor: {
        'main': '#333333',
        'secondary': '#999999',
        'inverse': '#ffffff',
      },
      colors: {
        'primary': '#0097ff',
        'subtle-inverse': '#9c9ec3',
      },
      borderRadius: {
        half: '50%',
        7: '1.75rem',
        5: '1.25rem',
        12: '3rem',
      },
      lineHeight: {
        14: '3.5rem',
      },
      maxWidth: {
        360: '90rem',
        300 : '75rem',
      },
    },
  },
  plugins: [],
}
export default config
