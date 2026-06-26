/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        "primary-dark": "#1E3A8A",
        "primary-light": "#3B82F6",
        secondary: "#475569",
        background: "#0F172A",
        surface: "#1E293B",
        "surface-2": "#334155",
        accent: "#F59E0B",
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        border: "#334155",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
      },
    },
  },
  plugins: [],
};