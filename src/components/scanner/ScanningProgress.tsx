import { useColors } from "@hooks/useColors";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from "react-native-reanimated";

import { Typography } from "../ui/Typography";

interface ScanningProgressProps {
  isScanning: boolean;
}

export function ScanningProgress({ isScanning }: ScanningProgressProps) {
  const colors = useColors();
  const progress = useSharedValue(0);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);
  const dot4 = useSharedValue(0.3);
  const dot5 = useSharedValue(0.3);

  useEffect(() => {
    if (isScanning) {
      progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);

      dot1.value = withRepeat(
        withDelay(0, withTiming(1, { duration: 300 })),
        -1,
        true
      );
      dot2.value = withRepeat(
        withDelay(100, withTiming(1, { duration: 300 })),
        -1,
        true
      );
      dot3.value = withRepeat(
        withDelay(200, withTiming(1, { duration: 300 })),
        -1,
        true
      );
      dot4.value = withRepeat(
        withDelay(300, withTiming(1, { duration: 300 })),
        -1,
        true
      );
      dot5.value = withRepeat(
        withDelay(400, withTiming(1, { duration: 300 })),
        -1,
        true
      );
    } else {
      progress.value = withTiming(0, { duration: 300 });
      dot1.value = withTiming(0.3);
      dot2.value = withTiming(0.3);
      dot3.value = withTiming(0.3);
      dot4.value = withTiming(0.3);
      dot5.value = withTiming(0.3);
    }
  }, [isScanning, progress, dot1, dot2, dot3, dot4, dot5]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${20 + progress.value * 60}%`,
    opacity: 0.5 + progress.value * 0.5
  }));

  const animatedColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#4CAF82", "#6EE7B7"]
    )
  }));

  const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value }));
  const dotStyle4 = useAnimatedStyle(() => ({ opacity: dot4.value }));
  const dotStyle5 = useAnimatedStyle(() => ({ opacity: dot5.value }));

  if (!isScanning) return null;

  return (
    <View className="absolute inset-0 bg-black/80 items-center justify-center p-8">
      <View
        className="rounded-2xl p-6 items-center w-full max-w-xs"
        style={{ backgroundColor: colors.surface }}
      >
        <ActivityIndicator size="large" color="#4CAF82" />

        <Typography
          variant="h4"
          weight="semibold"
          style={{ marginTop: 24, textAlign: "center" }}
        >
          Memproses Struk...
        </Typography>

        <Typography
          variant="body"
          color={colors.textSecondary}
          style={{ marginTop: 8, textAlign: "center" }}
        >
          Membaca informasi transaksi
        </Typography>

        <View
          className="w-full bg-gray-200 rounded-full mt-6 overflow-hidden"
          style={{ height: 4 }}
        >
          <Animated.View
            style={[animatedBarStyle, animatedColorStyle]}
            className="h-full rounded-full"
          />
        </View>

        <View className="flex-row gap-1 mt-4">
          <Animated.View
            style={[dotStyle1, { width: 4, height: 4, borderRadius: 2 }]}
            className="bg-primary"
          />
          <Animated.View
            style={[dotStyle2, { width: 4, height: 4, borderRadius: 2 }]}
            className="bg-primary"
          />
          <Animated.View
            style={[dotStyle3, { width: 4, height: 4, borderRadius: 2 }]}
            className="bg-primary"
          />
          <Animated.View
            style={[dotStyle4, { width: 4, height: 4, borderRadius: 2 }]}
            className="bg-primary"
          />
          <Animated.View
            style={[dotStyle5, { width: 4, height: 4, borderRadius: 2 }]}
            className="bg-primary"
          />
        </View>
      </View>
    </View>
  );
}
