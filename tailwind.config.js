module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F7FAF8",
        primary: "#4CAF82",
        "primary-light": "#E8F5EE",
        border: "#E5E7EB",
        error: "#EF4444",
        warning: "#F59E0B",
        success: "#10B981",
        "surface-secondary": "#F9FAFB",
        "text-primary": "#1A1A2E",
        "text-secondary": "#6B7280"
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px"
      },
      fontSize: {
        xs: ["11px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["15px", { lineHeight: "22px" }],
        lg: ["17px", { lineHeight: "24px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "38px" }],
        "4xl": ["36px", { lineHeight: "44px" }]
      }
    }
  },
  plugins: []
};
