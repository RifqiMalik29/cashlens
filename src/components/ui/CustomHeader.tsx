import { colors } from "@constants/theme";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "./Typography";

interface CustomHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function CustomHeader({
  title,
  showBack = false,
  onBack,
  rightElement
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white border-b border-border"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center h-[52px] px-4">
        <View className="w-10 items-start">
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              className="p-1"
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
        <Typography
          variant="h4"
          weight="semibold"
          numberOfLines={1}
          style={{ flex: 1, textAlign: "center" }}
        >
          {title ?? ""}
        </Typography>
        <View className="w-10 items-end">{rightElement}</View>
      </View>
    </View>
  );
}
