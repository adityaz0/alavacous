/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050608",
          900: "#090b0f",
          800: "#10141b",
          700: "#171c25",
        },
        glass: "rgba(255,255,255,0.06)",
        line: "rgba(255,255,255,0.11)",
        mint: "#6ee7b7",
        cyan: "#67e8f9",
        azure: "#7dd3fc",
        amber: "#f8d66d",
      },
      opacity: {
        15: "0.15",
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
      },
      boxShadow: {
        glow: "0 26px 100px rgba(103, 232, 249, 0.18)",
        panel: "0 34px 110px rgba(0, 0, 0, 0.46), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        auth: "0 42px 140px rgba(0, 0, 0, 0.58), 0 0 110px rgba(103, 232, 249, 0.11)",
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        rise: "rise 0.6s ease both",
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
