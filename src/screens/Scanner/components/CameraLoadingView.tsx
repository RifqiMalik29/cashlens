import { Typography } from "@components/ui/Typography";
import { View } from "react-native";

export function CameraLoadingView() {
  return (
    <View className="bg-surface-secondary/90 rounded-lg p-3 mb-4">
      <Typography
        variant="body"
        weight="medium"
        color="#1A1A2E"
        style={{ textAlign: "center" }}
      >
        Memuat kamera...
      </Typography>
    </View>
  );
}
