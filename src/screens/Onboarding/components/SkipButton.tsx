import { useTranslation } from "react-i18next";
import { Platform, Text, TouchableOpacity } from "react-native";

interface SkipButtonProps {
  onPress: () => void;
}

export function SkipButton({ onPress }: SkipButtonProps) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute right-6 z-10"
      style={{ top: Platform.OS === "ios" ? 50 : 60 }}
    >
      <Text className="text-base" style={{ color: "#6B7280" }}>
        {t("onboarding.skip")}
      </Text>
    </TouchableOpacity>
  );
}
