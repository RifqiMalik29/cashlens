import { StyleSheet, View } from "react-native";

const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 380;

interface ScannerOverlayProps {
  isScanning?: boolean;
}

export function ScannerOverlay({ isScanning }: ScannerOverlayProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Frame UI Only - Removed the background mask */}
      <View
        className="absolute inset-0 items-center justify-center"
        style={{ top: -60 }}
      >
        <View
          className={`border-2 ${isScanning ? "border-amber-400" : "border-primary"}`}
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            borderRadius: 24,
            backgroundColor: "transparent"
          }}
        >
          {/* Corner accents */}
          <View
            className={`absolute -top-1 -left-1 border-t-4 border-l-4 rounded-tl-xl ${isScanning ? "border-amber-400" : "border-primary"}`}
            style={{ width: 40, height: 40 }}
          />
          <View
            className={`absolute -top-1 -right-1 border-t-4 border-r-4 rounded-tr-xl ${isScanning ? "border-amber-400" : "border-primary"}`}
            style={{ width: 40, height: 40 }}
          />
          <View
            className={`absolute -bottom-1 -left-1 border-b-4 border-l-4 rounded-bl-xl ${isScanning ? "border-amber-400" : "border-primary"}`}
            style={{ width: 40, height: 40 }}
          />
          <View
            className={`absolute -bottom-1 -right-1 border-b-4 border-r-4 rounded-br-xl ${isScanning ? "border-amber-400" : "border-primary"}`}
            style={{ width: 40, height: 40 }}
          />
        </View>
      </View>
    </View>
  );
}
