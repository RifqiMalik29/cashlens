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
    <View className="flex-row items-center justify-between w-full px-10">
      <TouchableOpacity
        onPress={onPickFromGallery}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white/10 items-center justify-center border border-white/20"
      >
        <Image size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onTakePhoto}
        disabled={disabled}
        className="w-24 h-24 rounded-full bg-white/20 items-center justify-center border-2 border-white/30"
      >
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center shadow-lg">
          <Camera size={40} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onToggleFlash}
        disabled={disabled}
        className={`w-14 h-14 rounded-full items-center justify-center border border-white/20 ${
          flashEnabled ? "bg-amber-400" : "bg-white/10"
        }`}
      >
        <Zap size={28} color={flashEnabled ? "#000000" : "#FFFFFF"} />
      </TouchableOpacity>
    </View>
  );
}
