import { colors } from "@constants/theme";
import React from "react";
import { View, type ViewStyle } from "react-native";

import { Typography } from "./Typography";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "primary"
  | "secondary";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantConfig: Record<
  BadgeVariant,
  { containerClass: string; textColor: string }
> = {
  default: {
    containerClass: "bg-surface-secondary",
    textColor: colors.textSecondary
  },
  success: { containerClass: "bg-green-100", textColor: "#065F46" },
  warning: { containerClass: "bg-yellow-100", textColor: "#92400E" },
  error: { containerClass: "bg-red-100", textColor: "#991B1B" },
  primary: { containerClass: "bg-primary-light", textColor: colors.primary },
  secondary: {
    containerClass: "bg-surface-secondary",
    textColor: colors.textSecondary
  }
};

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const cfg = variantConfig[variant];

  return (
    <View
      className={`flex-row items-center px-2 py-1 rounded-full self-start ${cfg.containerClass}`}
      style={style}
    >
      <Typography variant="caption" weight="medium" color={cfg.textColor}>
        {label}
      </Typography>
    </View>
  );
}
