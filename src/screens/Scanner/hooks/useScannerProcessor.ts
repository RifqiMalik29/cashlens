import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { processReceiptIntelligence } from "@services/receiptParser";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { createLogger } from "@utils/logger";
import * as ImagePicker from "expo-image-picker";
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
  retryScan: () => Promise<void>;
  recordScan: () => Promise<void>;
  processingStatus: string;
  processingMethod?: "local_ocr" | "gemini_text" | "gemini_vision";
}

interface UseScannerProcessorOptions {
  isLimitReached: boolean;
  recordScan: () => Promise<void>;
}

export function useScannerProcessor({
  recordScan
}: UseScannerProcessorOptions): UseScannerProcessorResult {
  const router = useProtectedRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingMethod, setProcessingMethod] = useState<
    "local_ocr" | "gemini_text" | "gemini_vision" | undefined
  >();
  const [lastImageUri, setLastImageUri] = useState<string | null>(null);

  const categories = useCategoryStore((state) => state.categories);
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  const processScannedData = useCallback(
    async (imageUri: string) => {
      logger.debug("START INTELLIGENT SCAN");
      setLastImageUri(imageUri);
      setIsScanning(true);
      setError(null);
      setIsOffline(false);
      setProcessingStatus("AI sedang memproses...");

      try {
        const result = await processReceiptIntelligence(imageUri, (status) =>
          setProcessingStatus(status)
        );

        setProcessingMethod(result.method);

        if (result.method !== "local_ocr") {
          await recordScan();
          // Fetch the latest subscription data to update quota in the UI
          await fetchSubscription();
        } else {
          setIsOffline(true);
        }

        const geminiCategoryRaw = result.data.categoryId || "";
        const isUuid = /^[0-9a-f-]{36}$/i.test(geminiCategoryRaw);

        // Try to match by ID first, then by name
        const resolvedCategory = isUuid
          ? categories.find((c) => c.id === geminiCategoryRaw)
          : categories.find((c) => c.id === geminiCategoryRaw) ||
            categories.find(
              (c) => c.name.toLowerCase() === geminiCategoryRaw.toLowerCase()
            );
        const fallbackCategory =
          resolvedCategory ??
          categories.find((c) => c.name.toLowerCase() === "other") ??
          categories.find((c) => c.name.toLowerCase() === "lainnya") ??
          categories.find((c) => c.type === "expense") ??
          null;

        logger.debug("Scan result category raw:", geminiCategoryRaw);
        logger.debug(
          "Resolved category:",
          fallbackCategory?.id,
          fallbackCategory?.name
        );

        const params = new URLSearchParams({
          amount: result.data.amount?.toString() || "0",
          categoryId: fallbackCategory?.id || "",
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
        const message = (err as Error).message || "";
        // Let the screen handle the limit reached view, but
        // we can still get a 403 here if the quota was used up
        // on another device between when the screen loaded and the
        // user pressed the scan button.
        if (
          message.includes("403") ||
          message.toLowerCase().includes("limit") ||
          message.toLowerCase().includes("quota")
        ) {
          // Re-fetch subscription to make sure the UI is up to date
          await fetchSubscription();
        } else {
          setError(message || "Gagal memproses struk");
        }
      } finally {
        setIsScanning(false);
      }
    },
    [router, recordScan, categories, fetchSubscription]
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

  const retryScan = useCallback(async () => {
    if (lastImageUri) {
      await processScannedData(lastImageUri);
    }
  }, [lastImageUri, processScannedData]);

  return {
    isScanning,
    error,
    isOffline,
    processScannedData,
    handlePickFromGallery,
    dismissError,
    setError,
    retryScan,
    recordScan,
    processingStatus,
    processingMethod
  };
}
