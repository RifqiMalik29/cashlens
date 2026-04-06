import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeminiRateLimitError, parseReceiptText } from "@services/gemini";
import { recognizeText } from "@services/ocr";
import { parseReceipt } from "@services/receiptParser";
import { createLogger } from "@utils/logger";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

const logger = createLogger("[ScannerProcessor]");
const OCR_CACHE_PREFIX = "ocr_text_cache:";

interface ScannedData {
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  receiptImageUri?: string;
}

export function useScannerProcessor() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const processScannedData = useCallback(
    async (imageUri: string) => {
      logger.debug("START PROCESSING SCAN (ADVANCED HYBRID)");

      setIsScanning(true);
      setError(null);
      setIsOffline(false);

      try {
        let scannedData: ScannedData;

        // Step 1: ALWAYS run Local OCR first
        logger.debug("Step 1/3: Running Local OCR (ML Kit)...");

        // Caching raw text by MD5 to avoid re-running Gemini on the same text
        const file = new File(imageUri);
        const info = await file.info({ md5: true });
        const md5 = info.exists ? info.md5 : null;

        let rawText = "";
        if (md5) {
          const cachedText = await AsyncStorage.getItem(
            `${OCR_CACHE_PREFIX}${md5}`
          );
          if (cachedText) {
            logger.debug("✓ Found cached OCR text!");
            rawText = cachedText;
          }
        }

        if (!rawText) {
          rawText = await recognizeText(imageUri);
          if (md5) {
            await AsyncStorage.setItem(`${OCR_CACHE_PREFIX}${md5}`, rawText);
          }
        }

        if (!rawText || rawText.trim().length < 5) {
          throw new Error("Teks struk tidak terdeteksi atau terlalu pendek.");
        }

        // Step 2: Try AI Text Parsing (Much cheaper than vision)
        try {
          logger.debug("Step 2/3: Analyzing text with Gemini AI...");
          const aiResult = await parseReceiptText(rawText);

          scannedData = {
            amount: aiResult.amount,
            categoryId: aiResult.category,
            date: aiResult.date || new Date().toISOString(),
            note: aiResult.merchant || "Transaksi dari AI Scan (Text)",
            receiptImageUri: imageUri
          };
          logger.debug("✓ Gemini parsing successful!");
        } catch (aiError) {
          // Step 3: Local Regex Fallback
          if (aiError instanceof GeminiRateLimitError) {
            logger.warn("AI rate limit hit, using Local Regex Fallback");
            setIsOffline(true);
          } else {
            logger.warn("AI failed, using Local Regex Fallback:", aiError);
          }

          logger.debug("Step 3/3: Parsing with Local Regex Parser...");
          const parsed = parseReceipt(rawText);

          if (!parsed.amount) {
            throw new Error("Tidak dapat menemukan jumlah total pada struk.");
          }

          scannedData = {
            amount: parsed.amount,
            categoryId: parsed.categoryId || "cat_other_expense",
            date: parsed.date || new Date().toISOString(),
            note: parsed.note || "Transaksi dari scan (Local Regex)",
            receiptImageUri: imageUri
          };
          logger.debug("✓ Local Regex parsing successful!");
        }

        const params = new URLSearchParams({
          amount: scannedData.amount.toString(),
          categoryId: scannedData.categoryId,
          date: scannedData.date,
          note: scannedData.note,
          receiptImageUri: scannedData.receiptImageUri || "",
          isFromScan: "true"
        });

        router.push({
          pathname: "/(tabs)/transactions/add",
          params: Object.fromEntries(params)
        });
      } catch (err) {
        logger.error("✗ Processing failed:", err);
        setError((err as Error).message || "Gagal memproses struk");
      } finally {
        setIsScanning(false);
      }
    },
    [router]
  );

  const handlePickFromGallery = useCallback(async () => {
    logger.debug("[Gallery] Starting gallery picker...");

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      logger.debug("[Gallery] Gallery permission:", status);

      if (status !== "granted") {
        logger.debug("[Gallery] Permission denied");
        setError("Izin akses galeri diperlukan");
        return;
      }

      logger.debug("[Gallery] Launching image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8
      });

      if (result.canceled) {
        logger.debug("[Gallery] User canceled");
        return;
      }

      logger.debug("[Gallery] Image selected:", result.assets[0].uri);
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
    setError
  };
}
