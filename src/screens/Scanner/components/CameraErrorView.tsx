import { TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";

interface CameraErrorViewProps {
  onRefresh: () => void;
}

export function CameraErrorView({ onRefresh }: CameraErrorViewProps) {
  return (
    <View className="bg-warning/90 rounded-lg p-3 mb-4">
      <Typography variant="body" weight="medium" color="#FFFFFF">
        Kamera gagal dimuat. Periksa izin dan coba lagi.
      </Typography>
      <TouchableOpacity onPress={onRefresh} className="mt-2">
        <Typography variant="caption" weight="semibold" color="#FFFFFF">
          Refresh Kamera
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
