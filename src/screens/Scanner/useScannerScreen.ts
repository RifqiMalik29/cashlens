/* eslint-disable no-console */
import { useIsFocused } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { recognizeText } from "@/services/ocr";
import { parseReceipt } from "@/services/receiptParser";

const LOG_PREFIX = "[ScannerScreen]";

interface ScannedData {
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  receiptImageUri?: string;
}

export function useScannerScreen() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);

  const [permission, requestPermissionHandler] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const processScannedData = useCallback(
    async (imageUri: string) => {
      console.log(`\n${LOG_PREFIX} ========================================`);
      console.log(`${LOG_PREFIX} START PROCESSING SCAN`);
      console.log(`${LOG_PREFIX} ========================================`);
      console.log(`${LOG_PREFIX} Image URI: ${imageUri}`);

      setIsScanning(true);
      setError(null);

      try {
        console.log(`${LOG_PREFIX} Step 1/3: Running OCR...`);
        const text = await recognizeText(imageUri);

        console.log(`${LOG_PREFIX} Step 2/3: Parsing receipt...`);
        const parsed = parseReceipt(text);

        console.log(`${LOG_PREFIX} Step 3/3: Validating results...`);
        if (!parsed.amount) {
          console.log(`${LOG_PREFIX} ✗ No amount found in receipt`);
          setError("Tidak dapat menemukan jumlah total pada struk");
          setIsScanning(false);
          return;
        }

        const scannedData: ScannedData = {
          amount: parsed.amount,
          categoryId: parsed.categoryId || "cat_other_expense",
          date: parsed.date || new Date().toISOString(),
          note: parsed.note || "Transaksi dari scan",
          receiptImageUri: imageUri
        };

        console.log(`${LOG_PREFIX} ✓ Scan successful!`);
        console.log(
          `${LOG_PREFIX} Parsed data:`,
          JSON.stringify(scannedData, null, 2)
        );

        const params = new URLSearchParams({
          amount: scannedData.amount.toString(),
          categoryId: scannedData.categoryId,
          date: scannedData.date,
          note: scannedData.note,
          receiptImageUri: scannedData.receiptImageUri || "",
          isFromScan: "true"
        });

        const navigateUrl =
          `/(tabs)/transactions/add?${params.toString()}` as const;
        console.log(`${LOG_PREFIX} Navigating to: ${navigateUrl}`);

        router.push({
          pathname: "/(tabs)/transactions/add",
          params: Object.fromEntries(params)
        });
      } catch (error) {
        console.error(
          `${LOG_PREFIX} ✗ Processing failed:`,
          (error as Error).message
        );
        console.error(`${LOG_PREFIX} Stack:`, (error as Error).stack);
        setError((error as Error).message || "Gagal memproses struk");
      } finally {
        console.log(`${LOG_PREFIX} ========================================`);
        console.log(`${LOG_PREFIX} END PROCESSING`);
        console.log(`${LOG_PREFIX} ========================================\n`);
        setIsScanning(false);
      }
    },
    [router]
  );

  const handleTakePhoto = useCallback(async () => {
    console.log(`${LOG_PREFIX} [Take Photo] Capturing photo...`);

    try {
      if (!cameraRef.current) {
        console.log(`${LOG_PREFIX} [Take Photo] Camera ref not ready`);
        setError("Kamera belum siap");
        return;
      }

      console.log(`${LOG_PREFIX} [Take Photo] Taking picture...`);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false
      });

      if (!photo) {
        console.log(`${LOG_PREFIX} [Take Photo] Failed to capture`);
        setError("Gagal mengambil foto");
        return;
      }

      console.log(`${LOG_PREFIX} [Take Photo] Photo captured: ${photo.uri}`);
      await processScannedData(photo.uri);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} [Take Photo] Error:`,
        (error as Error).message
      );
      setError("Gagal mengambil foto");
    }
  }, [processScannedData]);

  const handlePickFromGallery = useCallback(async () => {
    console.log(`${LOG_PREFIX} [Gallery] Starting gallery picker...`);

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log(`${LOG_PREFIX} [Gallery] Gallery permission: ${status}`);

      if (status !== "granted") {
        console.log(`${LOG_PREFIX} [Gallery] Permission denied`);
        setError("Izin akses galeri diperlukan");
        return;
      }

      console.log(`${LOG_PREFIX} [Gallery] Launching image picker...`);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8
      });

      if (result.canceled) {
        console.log(`${LOG_PREFIX} [Gallery] User canceled`);
        return;
      }

      console.log(
        `${LOG_PREFIX} [Gallery] Image selected: ${result.assets[0].uri}`
      );
      await processScannedData(result.assets[0].uri);
    } catch (error) {
      console.error(`${LOG_PREFIX} [Gallery] Error:`, (error as Error).message);
      setError("Gagal memilih gambar dari galeri");
    }
  }, [processScannedData]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const dismissError = useCallback(() => {
    console.log(`${LOG_PREFIX} [Error] Dismissing error`);
    setError(null);
  }, []);

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

  const handleCameraReady = useCallback(() => {
    console.log("[ScannerScreen] Camera is ready");
    setCameraReady(true);
    setCameraError(false);
  }, []);

  const handleRefreshCamera = useCallback(async () => {
    console.log("[ScannerScreen] Refreshing camera...");
    setCameraReady(false);
    setCameraError(false);
    await requestPermission();
  }, [requestPermission]);

  return {
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
    handleRefreshCamera
  };
}
