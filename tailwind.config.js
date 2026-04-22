module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        primary: "#4CAF82",
        "primary-light": "var(--color-primary-light)",
        border: "var(--color-border)",
        error: "#EF4444",
        warning: "#F59E0B",
        success: "#10B981",
        surface: "var(--color-surface)",
        "surface-secondary": "var(--color-surface-secondary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)"
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
      },
      height: {
        input: "48px",
        "button-sm": "36px",
        "button-md": "44px",
        "button-lg": "52px",
        "tab-bar": "60px"
      }
    }
  },
  plugins: []
};
