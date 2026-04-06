import { createLogger } from "@utils/logger";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useRef, useState } from "react";

const logger = createLogger("[ScannerCamera]");
const CAMERA_READY_TIMEOUT_MS = 5000;

interface UseScannerCameraProps {
  onPhotoCaptured: (uri: string) => Promise<void>;
  onError: (message: string) => void;
  isScanning: boolean;
}

export function useScannerCamera({
  onPhotoCaptured,
  onError,
  isScanning
}: UseScannerCameraProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [permission, requestPermissionHandler] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Timeout fallback for simulators where camera may never be ready
  useEffect(() => {
    if (cameraReady || cameraError) return;
    readyTimeoutRef.current = setTimeout(() => {
      logger.warn("Camera ready timeout — possible simulator limitation");
      setCameraError(true);
    }, CAMERA_READY_TIMEOUT_MS);
    return () => {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, [cameraReady, cameraError]);

  const requestPermission = useCallback(async () => {
    logger.debug("[Permission] Requesting camera permission...");
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      logger.debug("[Permission] Status:", status);
      return status === "granted";
    } catch (error) {
      logger.error("[Permission] Error:", error);
      return false;
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    logger.debug("[Take Photo] Capturing photo...");

    try {
      if (!cameraRef.current) {
        logger.debug("[Take Photo] Camera ref not ready");
        onError("Kamera belum siap");
        return;
      }

      if (isScanning) return;

      logger.debug("[Take Photo] Taking picture...");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false
      });

      if (!photo) {
        logger.debug("[Take Photo] Failed to capture");
        onError("Gagal mengambil foto");
        return;
      }

      logger.debug("[Take Photo] Photo captured:", photo.uri);
      await onPhotoCaptured(photo.uri);
    } catch (error) {
      logger.error("[Take Photo] Error:", error);
      onError("Gagal mengambil foto");
    }
  }, [onPhotoCaptured, onError, isScanning]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const handleCameraReady = useCallback(() => {
    logger.debug("Camera is ready");
    setCameraReady(true);
    setCameraError(false);
  }, []);

  const handleRefreshCamera = useCallback(async () => {
    logger.debug("Refreshing camera...");
    setCameraReady(false);
    setCameraError(false);
    await requestPermission();
  }, [requestPermission]);

  return {
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
  };
}
