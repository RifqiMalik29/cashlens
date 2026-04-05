import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

interface AIProcessingIndicatorProps {
  isProcessing: boolean;
  stage?: "capturing" | "analyzing" | "extracting";
}

export function AIProcessingIndicator({
  isProcessing,
  stage = "analyzing"
}: AIProcessingIndicatorProps) {
  const [dots, setDots] = useState("");
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    if (!isProcessing) return;

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1
    );
  }, [isProcessing, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (!isProcessing) return null;

  const stageText = {
    capturing: "Capturing receipt",
    analyzing: "Analyzing with AI",
    extracting: "Extracting data"
  };

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/80 z-50">
      <Animated.View
        className="h-24 w-24 items-center justify-center rounded-full bg-primary/20"
        style={animatedStyle}
      >
        <ActivityIndicator size="large" color="#4CAF82" />
      </Animated.View>

      <Text className="mt-6 text-lg font-semibold text-white">
        {stageText[stage]}
        {dots}
      </Text>

      <Text className="mt-2 text-sm text-gray-400">
        This may take a few seconds
      </Text>
    </View>
  );
}
