import { Typography } from "@components/ui/Typography";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export function CameraInactiveView() {
  const { t } = useTranslation();

  return (
    <View
      style={StyleSheet.absoluteFill}
      className="items-center justify-center bg-black/50"
    >
      <Typography variant="body" color="#FFFFFF" weight="medium">
        {t("scanner.cameraInactive")}
      </Typography>
    </View>
  );
}
