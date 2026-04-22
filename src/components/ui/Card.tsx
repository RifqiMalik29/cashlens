import { useColors } from "@hooks/useColors";
import React from "react";
import { View, type ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  shadow?: "none" | "sm" | "md" | "lg";
}

const shadowClasses: Record<"none" | "sm" | "md" | "lg", string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg"
};

export function Card({
  children,
  className = "",
  style,
  shadow = "sm"
}: CardProps) {
  const colors = useColors();
  return (
    <View
      className={`rounded-lg p-4 ${shadowClasses[shadow]} ${className}`}
      style={[{ backgroundColor: colors.surface }, style]}
    >
      {children}
    </View>
  );
}
