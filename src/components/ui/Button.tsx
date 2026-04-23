import { heights } from "@constants/theme";
import { useColors } from "@hooks/useColors";
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

const sizeConfig: Record<
  ButtonSize,
  { containerClass: string; fontSize: number; height: number }
> = {
  sm: { containerClass: "px-3", fontSize: 13, height: heights.buttonSm },
  md: { containerClass: "px-4", fontSize: 15, height: heights.buttonMd },
  lg: { containerClass: "px-6", fontSize: 17, height: heights.buttonLg }
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
  const colors = useColors();
  const sizeCfg = sizeConfig[size];

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

  const varCfg = variantConfig[variant];

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
      style={{ height: sizeCfg.height, ...style }}
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
