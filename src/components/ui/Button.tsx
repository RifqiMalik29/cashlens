import { colors } from "@constants/theme";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  type ViewStyle
} from "react-native";

import { Typography } from "./Typography";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

const variantConfig: Record<
  ButtonVariant,
  { containerClass: string; textColor: string }
> = {
  primary: { containerClass: "bg-primary", textColor: colors.white },
  secondary: {
    containerClass: "bg-primary-light",
    textColor: colors.primary
  },
  ghost: { containerClass: "bg-transparent", textColor: colors.textPrimary },
  danger: { containerClass: "bg-red-100", textColor: colors.error }
};

const sizeConfig: Record<
  ButtonSize,
  { containerClass: string; fontSize: number }
> = {
  sm: { containerClass: "h-9 px-3", fontSize: 13 },
  md: { containerClass: "h-11 px-4", fontSize: 15 },
  lg: { containerClass: "h-[52px] px-6", fontSize: 17 }
};

export function Button({
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  children
}: ButtonProps) {
  const varCfg = variantConfig[variant];
  const sizeCfg = sizeConfig[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={[
        "flex-row items-center justify-center rounded-md",
        varCfg.containerClass,
        sizeCfg.containerClass,
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50" : ""
      ].join(" ")}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color={varCfg.textColor} />
      ) : (
        <Typography
          variant="body"
          weight="semibold"
          color={varCfg.textColor}
          style={{ fontSize: sizeCfg.fontSize }}
        >
          {children}
        </Typography>
      )}
    </TouchableOpacity>
  );
}
