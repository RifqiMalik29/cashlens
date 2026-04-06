import { Typography } from "@components/ui/Typography";
import { Platform , TouchableOpacity, View } from "react-native";

interface CameraErrorViewProps {
  onRefresh: () => void;
}

export function CameraErrorView({ onRefresh }: CameraErrorViewProps) {
  const isSimulator =
    Platform.OS === "ios" &&
    !("userAgent" in (globalThis as Record<string, unknown>));

  return (
    <View className="bg-warning/90 rounded-lg p-3 mb-4">
      <Typography variant="body" weight="medium" color="#FFFFFF">
        {isSimulator
          ? "Kamera tidak tersedia di simulator. Gunakan perangkat asli atau pilih dari galeri."
          : "Kamera gagal dimuat. Periksa izin dan coba lagi."}
      </Typography>
      {!isSimulator && (
        <TouchableOpacity onPress={onRefresh} className="mt-2">
          <Typography variant="caption" weight="semibold" color="#FFFFFF">
            Refresh Kamera
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}
