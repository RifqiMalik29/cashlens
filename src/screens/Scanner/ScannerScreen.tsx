import { AIProcessingIndicator } from "@components/scanner/AIProcessingIndicator";
import { ScannerOverlay } from "@components/scanner/ScannerOverlay";
import { ScanningProgress } from "@components/scanner/ScanningProgress";
import { Typography } from "@components/ui/Typography";
import { useHeader } from "@hooks/useHeader";
import { CameraView } from "expo-camera";
import { useKeepAwake } from "expo-keep-awake";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CameraErrorView,
  CameraInactiveView,
  CameraLoadingView,
  ErrorMessage,
  PermissionDeniedView,
  ScannerControls
} from "./components";
import { useScannerScreen } from "./useScannerScreen";

export default function ScannerScreen() {
  const {
    cameraRef,
    permission,
    requestPermissionHandler,
    isFocused,
    isScanning,
    error,
    flashEnabled,
    cameraReady,
    cameraError,
    isOffline,
    handleTakePhoto,
    handlePickFromGallery,
    toggleFlash,
    dismissError,
    handleCameraReady,
    handleRefreshCamera
  } = useScannerScreen();

  // Keep screen awake during scanning/processing
  useKeepAwake();

  useHeader({
    showHeader: false,
    statusBarColor: "#000000",
    statusBarStyle: "light"
  });

  if (!permission?.granted) {
    return (
      <PermissionDeniedView onRequestPermission={requestPermissionHandler} />
    );
  }

  return (
    <View className="flex-1 bg-black">
      {isFocused && !cameraError && (
        <CameraView
          key={isFocused ? "active" : "inactive"}
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flashEnabled ? "on" : "off"}
          active={isFocused as unknown as boolean}
          onCameraReady={handleCameraReady}
        />
      )}

      {!isFocused && <CameraInactiveView />}

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <ScannerOverlay />
        <ScanningProgress isScanning={isScanning} />

        {isOffline && (
          <View className="absolute top-24 left-4 right-4 rounded-xl bg-yellow-500/90 p-4 shadow-lg z-50">
            <Typography
              variant="body"
              weight="bold"
              color="#FFFFFF"
              style={{ textAlign: "center" }}
            >
              AI Mode Limit Terlampaui
            </Typography>
            <Typography
              variant="caption"
              color="#FFFFFF"
              style={{ textAlign: "center", marginTop: 2 }}
            >
              Menggunakan OCR offline sebagai fallback. Akurasi mungkin berbeda.
            </Typography>
          </View>
        )}
      </View>

      <AIProcessingIndicator
        isProcessing={isScanning}
        stage={isScanning ? "analyzing" : "capturing"}
      />

      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          {error && <ErrorMessage message={error} onDismiss={dismissError} />}

          {cameraError && <CameraErrorView onRefresh={handleRefreshCamera} />}

          {!cameraReady && !cameraError && isFocused && <CameraLoadingView />}

          <ScannerControls
            isScanning={isScanning}
            flashEnabled={flashEnabled}
            cameraReady={cameraReady}
            onTakePhoto={handleTakePhoto}
            onPickFromGallery={handlePickFromGallery}
            onToggleFlash={toggleFlash}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
