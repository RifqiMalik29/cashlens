import { useColors } from "@hooks/useColors";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Typography } from "./Typography";

interface SyncOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function SyncOverlay({
  isVisible,
  message = "Menyinkronkan data Anda..."
}: SyncOverlayProps) {
  const colors = useColors();
  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={StyleSheet.absoluteFill}
      className="z-[9999] flex-1 items-center justify-center bg-black/60"
    >
      <View
        className="items-center justify-center p-8 rounded-3xl shadow-lg"
        style={{ backgroundColor: colors.surface }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography
          variant="bodyLarge"
          weight="semibold"
          style={{ marginTop: 16, textAlign: "center" }}
        >
          {message}
        </Typography>
        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={{ marginTop: 4, textAlign: "center" }}
        >
          Mohon tunggu sebentar
        </Typography>
      </View>
    </Animated.View>
  );
}
