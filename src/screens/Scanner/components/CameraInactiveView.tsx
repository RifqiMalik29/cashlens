import { Typography } from "@components/ui/Typography";
import { StyleSheet, View } from "react-native";

export function CameraInactiveView() {
  return (
    <View
      style={StyleSheet.absoluteFill}
      className="items-center justify-center bg-black/50"
    >
      <Typography variant="body" color="#FFFFFF" weight="medium">
        Kamera tidak aktif di tab lain
      </Typography>
    </View>
  );
}
