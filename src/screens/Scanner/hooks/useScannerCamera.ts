/* eslint-disable no-console */
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useRef, useState } from "react";

const LOG_PREFIX = "[ScannerCamera]";

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

  const [permission, requestPermissionHandler] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const requestPermission = useCallback(async () => {
    console.log(`${LOG_PREFIX} [Permission] Requesting camera permission...`);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log(`${LOG_PREFIX} [Permission] Status: ${status}`);
      return status === "granted";
    } catch (error) {
      console.error(
        `${LOG_PREFIX} [Permission] Error:`,
        (error as Error).message
      );
      return false;
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    console.log(`${LOG_PREFIX} [Take Photo] Capturing photo...`);

    try {
      if (!cameraRef.current) {
        console.log(`${LOG_PREFIX} [Take Photo] Camera ref not ready`);
        onError("Kamera belum siap");
        return;
      }

      if (isScanning) return;

      console.log(`${LOG_PREFIX} [Take Photo] Taking picture...`);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false
      });

      if (!photo) {
        console.log(`${LOG_PREFIX} [Take Photo] Failed to capture`);
        onError("Gagal mengambil foto");
        return;
      }

      console.log(`${LOG_PREFIX} [Take Photo] Photo captured: ${photo.uri}`);
      await onPhotoCaptured(photo.uri);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} [Take Photo] Error:`,
        (error as Error).message
      );
      onError("Gagal mengambil foto");
    }
  }, [onPhotoCaptured, onError, isScanning]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const handleCameraReady = useCallback(() => {
    console.log(`${LOG_PREFIX} Camera is ready`);
    setCameraReady(true);
    setCameraError(false);
  }, []);

  const handleRefreshCamera = useCallback(async () => {
    console.log(`${LOG_PREFIX} Refreshing camera...`);
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
