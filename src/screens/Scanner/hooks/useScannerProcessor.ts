/* eslint-disable no-console */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeminiRateLimitError, parseReceiptText } from "@services/gemini";
import { recognizeText } from "@services/ocr";
import { parseReceipt } from "@services/receiptParser";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

const LOG_PREFIX = "[ScannerProcessor]";
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
      console.log(`\n${LOG_PREFIX} ========================================`);
      console.log(`${LOG_PREFIX} START PROCESSING SCAN (ADVANCED HYBRID)`);
      console.log(`${LOG_PREFIX} ========================================`);

      setIsScanning(true);
      setError(null);
      setIsOffline(false);

      try {
        let scannedData: ScannedData;

        // Step 1: ALWAYS run Local OCR first
        console.log(`${LOG_PREFIX} Step 1/3: Running Local OCR (ML Kit)...`);

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
            console.log(`${LOG_PREFIX} ✓ Found cached OCR text!`);
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
          console.log(
            `${LOG_PREFIX} Step 2/3: Analyzing text with Gemini AI...`
          );
          const aiResult = await parseReceiptText(rawText);

          scannedData = {
            amount: aiResult.amount,
            categoryId: aiResult.category,
            date: aiResult.date || new Date().toISOString(),
            note: aiResult.merchant || "Transaksi dari AI Scan (Text)",
            receiptImageUri: imageUri
          };
          console.log(`${LOG_PREFIX} ✓ Gemini parsing successful!`);
        } catch (aiError) {
          // Step 3: Local Regex Fallback
          if (aiError instanceof GeminiRateLimitError) {
            console.warn(
              `${LOG_PREFIX} AI rate limit hit, using Local Regex Fallback`
            );
            setIsOffline(true);
          } else {
            console.warn(
              `${LOG_PREFIX} AI failed, using Local Regex Fallback:`,
              (aiError as Error).message
            );
          }

          console.log(
            `${LOG_PREFIX} Step 3/3: Parsing with Local Regex Parser...`
          );
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
          console.log(`${LOG_PREFIX} ✓ Local Regex parsing successful!`);
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
        console.error(`${LOG_PREFIX} ✗ Processing failed:`, err);
        setError((err as Error).message || "Gagal memproses struk");
      } finally {
        setIsScanning(false);
        console.log(`${LOG_PREFIX} ========================================\n`);
      }
    },
    [router]
  );

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

  const dismissError = useCallback(() => {
    console.log(`${LOG_PREFIX} [Error] Dismissing error`);
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
