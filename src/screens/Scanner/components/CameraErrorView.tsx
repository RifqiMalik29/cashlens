import { Typography } from "@components/ui/Typography";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";

interface CameraErrorViewProps {
  onRefresh: () => void;
}

export function CameraErrorView({ onRefresh }: CameraErrorViewProps) {
  const { t } = useTranslation();
  const isSimulator =
    Platform.OS === "ios" &&
    !("userAgent" in (globalThis as Record<string, unknown>));

  return (
    <View className="bg-warning/90 rounded-lg p-3 mb-4">
      <Typography variant="body" weight="medium" color="#FFFFFF">
        {isSimulator
          ? t("scanner.cameraErrorSimulator")
          : t("scanner.cameraError")}
      </Typography>
      {!isSimulator && (
        <TouchableOpacity onPress={onRefresh} className="mt-2">
          <Typography variant="caption" weight="semibold" color="#FFFFFF">
            {t("scanner.refreshCamera")}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}
