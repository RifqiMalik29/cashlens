import { Platform, Text, TouchableOpacity } from "react-native";

interface SkipButtonProps {
  onPress: () => void;
}

export function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute right-6 z-10"
      style={{ top: Platform.OS === "ios" ? 50 : 60 }}
    >
      <Text className="text-base" style={{ color: "#6B7280" }}>
        Lewati
      </Text>
    </TouchableOpacity>
  );
}
