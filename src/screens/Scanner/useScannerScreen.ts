import { useQuota } from "@hooks/useQuota";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useScannerCamera } from "./hooks/useScannerCamera";
import { useScannerProcessor } from "./hooks/useScannerProcessor";

export function useScannerScreen() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { scanCount, scanLimit, isScanLimitReached, recordScan, isPremium } =
    useQuota();
  const remaining = Math.max(0, scanLimit - scanCount);

  const {
    isScanning,
    error,
    isOffline,
    processScannedData,
    handlePickFromGallery,
    dismissError,
    setError,
    retryScan,
    processingStatus,
    processingMethod
  } = useScannerProcessor({ isLimitReached: isScanLimitReached, recordScan });

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
    retryScan,
    handleCameraReady,
    handleRefreshCamera,
    isOffline,
    remainingScans: remaining,
    scanLimit,
    processingStatus,
    processingMethod,
    isPremium,
    isLimitReached: isScanLimitReached
  };
}
