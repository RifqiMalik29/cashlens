import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function CameraLoadingView() {
  const { t } = useTranslation();
  const colors = useColors();
  return (
    <View className="bg-surface-secondary/90 rounded-lg p-3 mb-4">
      <Typography
        variant="body"
        weight="medium"
        color={colors.textPrimary}
        style={{ textAlign: "center" }}
      >
        {t("scanner.cameraLoading")}
      </Typography>
    </View>
  );
}
