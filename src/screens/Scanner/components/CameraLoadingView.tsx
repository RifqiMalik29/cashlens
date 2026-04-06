import { Typography } from "@components/ui/Typography";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function CameraLoadingView() {
  const { t } = useTranslation();
  return (
    <View className="bg-surface-secondary/90 rounded-lg p-3 mb-4">
      <Typography
        variant="body"
        weight="medium"
        color="#1A1A2E"
        style={{ textAlign: "center" }}
      >
        {t("scanner.cameraLoading")}
      </Typography>
    </View>
  );
}
