import { useTranslation } from "react-i18next";
import { StyleSheet,View } from "react-native";

import { Typography } from "../ui";

const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 380;

interface ScannerOverlayProps {
  isScanning?: boolean;
}

export function ScannerOverlay({ isScanning }: ScannerOverlayProps) {
  const { t } = useTranslation();

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

        {!isScanning && (
          <View className="mt-10 px-6">
            <View className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full flex-row items-center border border-white/20">
              <View className="w-2 h-2 bg-primary rounded-full mr-3" />
              <Typography color="#FFFFFF" weight="semibold">
                {t("scanner.positionReceipt")}
              </Typography>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
