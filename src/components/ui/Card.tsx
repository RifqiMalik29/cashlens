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
  return (
    <View
      className={`bg-white rounded-lg p-4 ${shadowClasses[shadow]} ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}
