import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "@utils/logger";
import { File } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

import { receiptService } from "./api/receiptService";

const logger = createLogger("[GeminiAI]");
const CACHE_PREFIX = "gemini_cache_v1:";

export interface GeminiReceiptResponse {
  amount: number;
  currency: string;
  date: string;
  time?: string;
  merchant: string;
  category: string;
  items: {
    name: string;
    quantity?: number;
    price: number;
  }[];
  paymentMethod?: string;
  confidence: number;
}

export class GeminiRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiRateLimitError";
  }
}

/**
 * Parses a receipt image directly (Via Go Backend Proxy)
 */
export async function parseReceiptImage(
  imageUri: string
): Promise<GeminiReceiptResponse> {
  logger.debug("Starting receipt parsing via Go Backend Proxy (Vision)...");

  try {
    const file = new File(imageUri);
    const info = await file.info({ md5: true });
    const cacheKey = info.exists ? `${CACHE_PREFIX}${info.md5}` : null;

    if (cacheKey) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        logger.debug("✓ Using CACHED result for this image!");
        return JSON.parse(cachedData);
      }
    }

    const compressedUri = await compressImage(imageUri);

    logger.debug("Sending image to Backend...");

    const result = await receiptService.scanReceipt(compressedUri);

    const parsed: GeminiReceiptResponse = {
      amount: result.amount,
      currency: "IDR",
      date: result.date,
      merchant: result.merchant,
      category: result.category,
      items: result.items || [],
      confidence: result.confidence
    };

    if (cacheKey) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(parsed));
    }

    return parsed;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("quota")
    ) {
      throw new GeminiRateLimitError("AI rate limit exceeded.");
    }
    throw new Error(`AI Parsing Error: ${errorMessage}`);
  }
}

async function compressImage(imageUri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    logger.error("Image compression failed, using original image.", error);
    return imageUri;
  }
}

export function isGeminiAvailable(): boolean {
  // Now using backend proxy, so we assume AI is available if the app can reach the backend
  return true;
}
