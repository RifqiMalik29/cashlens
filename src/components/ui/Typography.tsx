import { colors } from "@constants/theme";
import React from "react";
import { Text, type TextStyle } from "react-native";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "bodyLarge"
  | "caption"
  | "label";
type Weight = "regular" | "medium" | "semibold" | "bold";

interface TypographyProps {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

const variantClasses: Record<Variant, string> = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-lg",
  bodyLarge: "text-base",
  body: "text-sm",
  caption: "text-xs",
  label: "text-xs uppercase tracking-widest"
};

const weightClasses: Record<Weight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

export function Typography({
  variant = "body",
  weight = "regular",
  color = colors.textPrimary,
  style,
  children,
  numberOfLines
}: TypographyProps) {
  return (
    <Text
      className={`${variantClasses[variant]} ${weightClasses[weight]}`}
      style={[{ color }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
