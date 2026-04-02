import { Typography } from "@components/ui/Typography";
import { Camera, Image, Zap } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface ScannerControlsProps {
  isScanning: boolean;
  flashEnabled: boolean;
  cameraReady: boolean;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onToggleFlash: () => void;
}

export function ScannerControls({
  isScanning,
  flashEnabled,
  cameraReady,
  onTakePhoto,
  onPickFromGallery,
  onToggleFlash
}: ScannerControlsProps) {
  const disabled = isScanning || !cameraReady;

  return (
    <View className="flex-row items-center justify-around gap-4">
      <TouchableOpacity
        onPress={onPickFromGallery}
        disabled={disabled}
        className="items-center"
      >
        <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center backdrop-blur-sm">
          <Image size={28} color="#FFFFFF" />
        </View>
        <Typography variant="caption" color="#FFFFFF" style={{ marginTop: 4 }}>
          Galeri
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onTakePhoto}
        disabled={disabled}
        className="items-center"
      >
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center border-4 border-white/50">
          <Camera size={36} color="#FFFFFF" />
        </View>
        <Typography variant="caption" color="#FFFFFF" style={{ marginTop: 4 }}>
          Ambil Foto
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onToggleFlash}
        disabled={disabled}
        className="items-center"
      >
        <View
          className={`w-14 h-14 rounded-full items-center justify-center backdrop-blur-sm ${
            flashEnabled ? "bg-yellow-500/80" : "bg-white/20"
          }`}
        >
          <Zap size={28} color="#FFFFFF" />
        </View>
        <Typography variant="caption" color="#FFFFFF" style={{ marginTop: 4 }}>
          Flash
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
