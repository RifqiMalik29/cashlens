import { processReceiptIntelligence } from "@services/receiptParser";
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

const logger = createLogger("[ScannerProcessor]");

interface UseScannerProcessorResult {
  isScanning: boolean;
  error: string | null;
  isOffline: boolean;
  processScannedData: (uri: string) => Promise<void>;
  handlePickFromGallery: () => Promise<void>;
  dismissError: () => void;
  setError: (msg: string) => void;
  recordScan: () => Promise<void>;
  processingStatus: string;
  processingMethod?: "local_ocr" | "gemini_text" | "gemini_vision";
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
}

interface UseScannerProcessorOptions {
  isLimitReached: boolean;
  recordScan: () => Promise<void>;
}

export function useScannerProcessor({
  recordScan
}: UseScannerProcessorOptions): UseScannerProcessorResult {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingMethod, setProcessingMethod] = useState<
    "local_ocr" | "gemini_text" | "gemini_vision" | undefined
  >();
  const [showPaywall, setShowPaywall] = useState(false);

  const { subscriptionTier, stealthScansUsed } = useAuthStore();

  const processScannedData = useCallback(
    async (imageUri: string) => {
      // PAYWALL CHECK: If free user and already used 5 magic scans
      if (subscriptionTier === "free" && stealthScansUsed >= 5) {
        setShowPaywall(true);
        return;
      }

      logger.debug("START INTELLIGENT SCAN");
      setIsScanning(true);
      setError(null);
      setIsOffline(false);
      setProcessingStatus("Menyiapkan pemindaian...");

      try {
        const result = await processReceiptIntelligence(imageUri, (status) =>
          setProcessingStatus(status)
        );

        setProcessingMethod(result.method);

        if (result.method !== "local_ocr") {
          await recordScan();
        } else {
          setIsOffline(true);
        }

        const params = new URLSearchParams({
          amount: result.data.amount?.toString() || "0",
          categoryId: result.data.categoryId || "cat_other_expense",
          date: result.data.date || new Date().toISOString(),
          note: result.data.note || "Transaksi dari AI Scan",
          receiptImageUri: imageUri,
          isFromScan: "true"
        });

        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/transactions/add",
            params: Object.fromEntries(params)
          });
        }, 500);
      } catch (err) {
        logger.error("✗ Intelligent processing failed:", err);
        setError((err as Error).message || "Gagal memproses struk");
      } finally {
        setIsScanning(false);
      }
    },
    [router, recordScan, subscriptionTier, stealthScansUsed]
  );

  const handlePickFromGallery = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Izin akses galeri diperlukan");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8
      });

      if (result.canceled) return;
      await processScannedData(result.assets[0].uri);
    } catch (error) {
      logger.error("[Gallery] Error:", error);
      setError("Gagal memilih gambar dari galeri");
    }
  }, [processScannedData]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isScanning,
    error,
    isOffline,
    processScannedData,
    handlePickFromGallery,
    dismissError,
    setError,
    recordScan,
    processingStatus,
    processingMethod,
    showPaywall,
    setShowPaywall
  };
}
