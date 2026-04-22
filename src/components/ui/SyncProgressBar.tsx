import { useColors } from "@hooks/useColors";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";

interface SyncProgressBarProps {
  isVisible: boolean;
}

export function SyncProgressBar({ isVisible }: SyncProgressBarProps) {
  const colors = useColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
    } else {
      progress.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-100, 100],
      Extrapolate.CLAMP
    );

    const opacity = withTiming(isVisible ? 1 : 0);

    return {
      transform: [{ translateX: `${translateX}%` }],
      opacity
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.bar, { backgroundColor: colors.primary }, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 3,
    width: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999
  },
  bar: {
    height: "100%",
    width: "40%",
    borderRadius: 2
  }
});
