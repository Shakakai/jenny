import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Background: zinc-950 (#09090b)
        // Sidebar: zinc-900 (#18181b)
        // Cards: zinc-900 with zinc-800 border
        // Accent: violet-500 (#8b5cf6)
        // Text primary: zinc-100
        // Text muted: zinc-400
      },
    },
  },
  plugins: [],
} satisfies Config
