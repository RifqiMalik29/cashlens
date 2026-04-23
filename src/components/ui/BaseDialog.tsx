import { useColors } from "@hooks/useColors";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Button } from "./Button";
import { Typography } from "./Typography";

interface BaseDialogProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  isLoading?: boolean;
  onClose?: () => void;
  primaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  type?: "info" | "success" | "error" | "warning";
}

export function BaseDialog({
  isVisible,
  title,
  message,
  isLoading,
  onClose,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  type = "info"
}: BaseDialogProps) {
  const colors = useColors();
  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={StyleSheet.absoluteFill}
        className="flex-1 items-center justify-center bg-black/60 px-6"
      >
        <View
          className="w-full max-w-sm items-center justify-center p-6 rounded-3xl shadow-lg"
          style={{ backgroundColor: colors.surface }}
        >
          {isLoading && (
            <View className="mb-4">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {title && (
            <Typography
              variant="h3"
              weight="bold"
              style={{ textAlign: "center", marginBottom: 8 }}
              color={type === "error" ? colors.error : colors.textPrimary}
            >
              {title}
            </Typography>
          )}

          {message && (
            <Typography
              variant="body"
              color={colors.textSecondary}
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              {message}
            </Typography>
          )}

          <View className="w-full gap-3">
            {primaryButtonText && onPrimaryButtonPress && (
              <Button
                onPress={onPrimaryButtonPress}
                variant={type === "error" ? "danger" : "primary"}
                fullWidth
              >
                {primaryButtonText}
              </Button>
            )}
            {secondaryButtonText && onSecondaryButtonPress && (
              <Button
                onPress={onSecondaryButtonPress}
                variant="secondary"
                fullWidth
              >
                {secondaryButtonText}
              </Button>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
