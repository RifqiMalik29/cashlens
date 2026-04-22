export const colors = {
  background: "#F7FAF8",
  primary: "#4CAF82",
  primaryLight: "#E8F5EE",
  white: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  surface: "#FFFFFF",
  surfaceSecondary: "#F9FAFB",
  overlay: "rgba(0,0,0,0.5)"
};

export const darkColors = {
  background: "#0F1A14",
  primary: "#4CAF82",
  primaryLight: "#1A3326",
  white: "#1C2B22",
  textPrimary: "#F0F4F1",
  textSecondary: "#9AB5A3",
  border: "#2D3F35",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  surface: "#1C2B22",
  surfaceSecondary: "#162318",
  overlay: "rgba(0,0,0,0.7)"
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6
  }
};

export const heights = {
  input: 48,
  buttonSm: 36,
  buttonMd: 44,
  buttonLg: 52,
  tabBar: 60,
  dotIndicator: 8,
  dotIndicatorActive: 8
};

export const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  heights
};

export default theme;
