import { ScannerOverlay } from "@components/scanner/ScannerOverlay";
import { BaseDialog } from "@components/ui";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet,View } from "react-native";

import {
  AIProcessingIndicator,
  CameraErrorView,
  CameraInactiveView,
  CameraLoadingView,
  ErrorMessage,
  PermissionDeniedView,
  ScannerControls
} from "./components";
import { useScannerScreen } from "./useScannerScreen";

export default function ScannerScreen() {
  const router = useRouter();
  const {
    t,
    cameraRef,
    permission,
    requestPermissionHandler,
    isFocused,
    isScanning,
    error,
    flashEnabled,
    cameraReady,
    cameraError,
    handleTakePhoto,
    handlePickFromGallery,
    toggleFlash,
    dismissError,
    handleCameraReady,
    handleRefreshCamera,
    processingStatus,
    processingMethod,
    showPaywall,
    setShowPaywall
  } = useScannerScreen();

  if (!permission) {
    return <CameraLoadingView />;
  }

  if (!permission.granted) {
    return (
      <PermissionDeniedView onRequestPermission={requestPermissionHandler} />
    );
  }

  if (cameraError) {
    return <CameraErrorView onRefresh={handleRefreshCamera} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Background / Camera Layer */}
      <View style={StyleSheet.absoluteFill} className="bg-black">
        {isFocused ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={flashEnabled}
            onCameraReady={handleCameraReady}
          />
        ) : (
          <CameraInactiveView />
        )}
      </View>

      {/* 2. Overlay Layer (Mask and Frame) */}
      <ScannerOverlay isScanning={isScanning} />

      {/* 3. Controls Layer (Bottom) */}
      <View style={styles.controlsContainer}>
        <ScannerControls
          onTakePhoto={handleTakePhoto}
          onPickFromGallery={handlePickFromGallery}
          onToggleFlash={toggleFlash}
          flashEnabled={flashEnabled}
          isScanning={isScanning}
          cameraReady={cameraReady}
        />
      </View>

      {/* 4. Feedback Layer (Top Toast) */}
      <ErrorMessage error={error} onDismiss={dismissError} />

      {/* 5. Modals / Overlays */}
      {isScanning && (
        <AIProcessingIndicator
          status={processingStatus}
          method={processingMethod}
        />
      )}

      <BaseDialog
        isVisible={showPaywall}
        title={t("paywall.title")}
        message={t("paywall.message")}
        type="warning"
        primaryButtonText={t("paywall.upgrade")}
        onPrimaryButtonPress={() => {
          setShowPaywall(false);
          router.push("/(tabs)/settings");
        }}
        secondaryButtonText={t("paywall.later")}
        onSecondaryButtonPress={() => setShowPaywall(false)}
        onClose={() => setShowPaywall(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000"
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 60,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent" // Let the gradient or blur handle it if needed
  }
});
