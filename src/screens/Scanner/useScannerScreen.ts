import { useScanQuota } from "@hooks/useScanQuota";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useScannerCamera } from "./hooks/useScannerCamera";
import { useScannerProcessor } from "./hooks/useScannerProcessor";

export function useScannerScreen() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { remaining, limit, isLimitReached, recordScan } = useScanQuota();

  const {
    isScanning,
    error,
    isOffline,
    processScannedData,
    handlePickFromGallery,
    dismissError,
    setError,
    processingStatus,
    processingMethod,
    showPaywall,
    setShowPaywall
  } = useScannerProcessor({ isLimitReached, recordScan });

  const {
    cameraRef,
    permission,
    requestPermissionHandler,
    flashEnabled,
    cameraReady,
    cameraError,
    handleTakePhoto,
    toggleFlash,
    handleCameraReady,
    handleRefreshCamera
  } = useScannerCamera({
    onPhotoCaptured: processScannedData,
    onError: (msg) => setError(msg),
    isScanning,
    isFocused
  });

  return {
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
    isOffline,
    remainingScans: remaining,
    scanLimit: limit,
    isLimitReached,
    processingStatus,
    processingMethod,
    showPaywall,
    setShowPaywall
  };
}
