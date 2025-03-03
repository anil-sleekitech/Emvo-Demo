import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-pink': '#ec4899',
        'custom-purple': '#8b5cf6',
        'spiral-purple': '#9351E2',
        'spiral-pink': '#EE7794',
        'spiral-blue': '#4F46E5',
        'spiral-bg': '#E6EFFF',
      },
      backgroundImage: {
        'spiral-gradient': 'linear-gradient(135deg, #9351E2, #EE7794, #4F46E5)',
      }
    },
  },
  plugins: [],
} satisfies Config;
