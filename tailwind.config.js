/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09090B",
          900: "#0c0c0e",
          800: "#111113",
          700: "#18181b",
        },
        glass: "#111113",
        line: "rgba(255,255,255,0.03)",
        mint: "#a1a1aa",
        cyan: "#fafafa",
        azure: "#d4d4d8",
        amber: "#f8d66d",
      },
      opacity: {
        12: "0.12",
        14: "0.14",
        15: "0.15",
        16: "0.16",
        18: "0.18",
        35: "0.35",
        42: "0.42",
        45: "0.45",
        46: "0.46",
        48: "0.48",
        52: "0.52",
        54: "0.54",
        55: "0.55",
        56: "0.56",
        58: "0.58",
        62: "0.62",
        64: "0.64",
        65: "0.65",
        68: "0.68",
        72: "0.72",
        78: "0.78",
        86: "0.86",
      },
      boxShadow: {
        glow: "none",
        panel: "none",
        auth: "none",
      },
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      animation: {
        float: "none",
        shimmer: "none",
        rise: "none",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
