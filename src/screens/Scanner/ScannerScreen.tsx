import { ScannerOverlay } from "@components/scanner/ScannerOverlay";
import { Typography } from "@components/ui";
import { BaseDialog } from "@components/ui/BaseDialog";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { CameraView } from "expo-camera";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View } from "react-native";

import {
  AIProcessingIndicator,
  CameraErrorView,
  CameraInactiveView,
  CameraLoadingView,
  LimitReachedView,
  PermissionDeniedView,
  ScannerControls
} from "./components";
import { useScannerScreen } from "./useScannerScreen";

export default function ScannerScreen() {
  const router = useProtectedRouter();
  const { t } = useTranslation();
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
    handleTakePhoto,
    handlePickFromGallery,
    toggleFlash,
    dismissError,
    retryScan,
    handleCameraReady,
    handleRefreshCamera,
    processingStatus,
    processingMethod,
    remainingScans,
    scanLimit,
    isPremium,
    isLimitReached
  } = useScannerScreen();

  if (isLimitReached) {
    return <LimitReachedView onUpgrade={() => router.push("/upgrade")} />;
  }

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
        {!isPremium && (
          <View className="bg-amber-500/90 px-4 py-1.5 rounded-full mb-6 flex-row items-center border border-amber-300">
            <Typography variant="body" weight="bold" color="white">
              {t("scanner.premiumAI", { remainingScans, scanLimit })}
            </Typography>
          </View>
        )}
        <ScannerControls
          onTakePhoto={handleTakePhoto}
          onPickFromGallery={handlePickFromGallery}
          onToggleFlash={toggleFlash}
          flashEnabled={flashEnabled}
          isScanning={isScanning}
          cameraReady={cameraReady}
        />
      </View>

      {/* 4. Scan Error Dialog */}
      <BaseDialog
        isVisible={!!error}
        title={t("scanner.scanFailedTitle")}
        message={error ?? ""}
        type="error"
        primaryButtonText={t("scanner.retry")}
        onPrimaryButtonPress={() => {
          dismissError();
          retryScan();
        }}
        secondaryButtonText={t("scanner.enterManually")}
        onSecondaryButtonPress={() => {
          dismissError();
          router.push("/(tabs)/transactions/add");
        }}
        onClose={dismissError}
      />

      {/* 5. Modals / Overlays */}
      {isScanning && (
        <AIProcessingIndicator
          status={processingStatus}
          method={processingMethod}
        />
      )}
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
