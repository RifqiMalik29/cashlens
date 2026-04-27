import { createLogger } from "@utils/logger";
import { useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";

const logger = createLogger("[ScannerCamera]");
const CAMERA_READY_TIMEOUT_MS = 10000;

interface UseScannerCameraProps {
  onPhotoCaptured: (uri: string) => Promise<void>;
  onError: (message: string) => void;
  isScanning: boolean;
  isFocused: boolean;
}

export function useScannerCamera({
  onPhotoCaptured,
  onError,
  isScanning,
  isFocused
}: UseScannerCameraProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [permission, requestPermissionHandler] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (!isFocused || cameraReady || cameraError) {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      return;
    }

    // Start timeout to detect if camera fails to load
    readyTimeoutRef.current = setTimeout(() => {
      if (!cameraReady && isFocused) {
        logger.warn("Camera ready timeout reached");
        // On some devices, camera takes a long time.
        // We set error only if it's still not ready after 10s.
        setCameraError(true);
      }
    }, CAMERA_READY_TIMEOUT_MS);

    return () => {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, [cameraReady, cameraError, isFocused]);

  const handleTakePhoto = useCallback(async () => {
    logger.debug("[Take Photo] Capturing photo...");

    try {
      if (!cameraRef.current || !cameraReady) {
        logger.debug("[Take Photo] Camera not ready");
        onError("Kamera belum siap");
        return;
      }

      if (isScanning) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true
      });

      if (!photo) {
        onError("Gagal mengambil foto");
        return;
      }

      logger.debug("[Take Photo] Photo captured:", photo.uri);
      await onPhotoCaptured(photo.uri);
    } catch (error) {
      logger.error("[Take Photo] Error:", error);
      onError("Gagal mengambil foto");
    }
  }, [onPhotoCaptured, onError, isScanning, cameraReady]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const handleCameraReady = useCallback(() => {
    logger.debug("Camera is ready event received");
    setCameraReady(true);
    setCameraError(false);
    if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
  }, []);

  const handleRefreshCamera = useCallback(() => {
    logger.debug("Refreshing camera...");
    setCameraReady(false);
    setCameraError(false);
    requestPermissionHandler();
  }, [requestPermissionHandler]);

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
