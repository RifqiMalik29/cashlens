import { useColors } from "@hooks/useColors";
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

export function Badge({ label, variant = "default", style }: BadgeProps) {
  const colors = useColors();

  const bgColor =
    variant === "success"
      ? "#D1FAE5"
      : variant === "warning"
        ? "#FEF3C7"
        : variant === "error"
          ? "#FEE2E2"
          : variant === "primary"
            ? colors.primaryLight
            : colors.surfaceSecondary;

  const textColor =
    variant === "success"
      ? "#065F46"
      : variant === "warning"
        ? "#92400E"
        : variant === "error"
          ? "#991B1B"
          : variant === "primary"
            ? colors.primary
            : colors.textSecondary;

  return (
    <View
      className="flex-row items-center px-2 py-1 rounded-full self-start"
      style={[{ backgroundColor: bgColor }, style]}
    >
      <Typography variant="caption" weight="medium" color={textColor}>
        {label}
      </Typography>
    </View>
  );
}
