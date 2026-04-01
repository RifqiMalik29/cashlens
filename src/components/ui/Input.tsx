import { colors, fontSizes, heights } from "@constants/theme";
import React, { useState } from "react";
import { TextInput, View, type ViewStyle } from "react-native";

import { Typography } from "./Typography";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  style?: ViewStyle;
  editable?: boolean;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
  error,
  rightElement,
  leftElement,
  style,
  editable = true
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? "border-error"
    : focused
      ? "border-primary"
      : "border-border";

  return (
    <View className="gap-1" style={style}>
      {label && (
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
        >
          {label}
        </Typography>
      )}
      <View
        className={`flex-row items-center px-3 rounded-md bg-white border ${borderClass} ${
          !editable ? "bg-surface-secondary" : ""
        }`}
        style={{ height: heights.input }}
      >
        {leftElement && <View className="mr-2">{leftElement}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          style={{
            flex: 1,
            fontSize: fontSizes.base,
            color: colors.textPrimary,
            paddingVertical: 0,
            ...(multiline && {
              height: numberOfLines * 24,
              textAlignVertical: "top"
            })
          }}
        />
        {rightElement && <View className="ml-2">{rightElement}</View>}
      </View>
      {error && (
        <Typography variant="caption" color={colors.error}>
          {error}
        </Typography>
      )}
    </View>
  );
}
