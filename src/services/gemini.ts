import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "@utils/logger";
import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const logger = createLogger("[GeminiAI]");
const CACHE_PREFIX = "gemini_cache_v1:";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  logger.error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// Using Gemini 3.1 Flash-Lite for improved performance and 500 RPD free tier
const model = genAI.getGenerativeModel(
  {
    model: "gemini-3.1-flash-lite-preview",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  },
  { apiVersion: "v1beta" }
);

export interface GeminiReceiptResponse {
  amount: number;
  currency: string;
  date: string;
  time?: string;
  merchant: string;
  category: string;
  items: {
    name: string;
    quantity: number;
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
 * Parses a receipt image directly (Vision Mode)
 */
export async function parseReceiptImage(
  imageUri: string
): Promise<GeminiReceiptResponse> {
  logger.debug(
    "Starting receipt parsing using model: gemini-3.1-flash-lite-preview (Vision)..."
  );

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

    const compressedImage = await compressImage(imageUri);
    const base64Image = await imageToBase64(compressedImage);

    logger.debug(
      `Sending image to Gemini... (Base64 length: ${base64Image.length})`
    );

    const prompt = `You are a high-precision receipt parsing engine. Analyze this image and return ONLY a JSON object.

Structure:
{
  "amount": <number: actual total paid for items>,
  "currency": "IDR",
  "date": "YYYY-MM-DD",
  "merchant": "<string: brand name from top of receipt>",
  "category": "<string: internal_category_id>",
  "items": [{"name": string, "price": number}],
  "confidence": <number: 0-100>
}

Merchant Extraction Rules:
- The merchant is usually at the VERY TOP. 
- Stylized fonts can be tricky: "Cendol" might look like "Enda". Look at the item list to confirm if the merchant name appears there too.
- Clean the name: Remove addresses, phone numbers, and slogans.

Category Selection Logic:
- cat_food: If you see items like "Mie", "Bakso", "Ayam", "Cendol", "Nasi", "Drink", "Food", or any restaurant names.
- cat_shopping: For clothes, electronics, or general department stores.
- cat_transport: For fuel, parking, or rideshare.
- Default to "cat_other_expense" only if absolutely zero context is found.

Anti-Hallucination Rules:
- IGNORE "Tunai", "Cash", or "Bayar" lines when picking the "amount". 
- IGNORE "Kembalian" or "Change".
- The "amount" must equal the sum of item prices if available.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    // Safe parse even if model still includes markers
    const cleanedJson = text.includes("```")
      ? text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      : text.trim();
    const parsed = JSON.parse(cleanedJson) as GeminiReceiptResponse;

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

/**
 * Parses raw OCR text (Advanced Hybrid Mode - Cheaper and Faster)
 */
export async function parseReceiptText(
  ocrText: string
): Promise<GeminiReceiptResponse> {
  logger.debug("Starting receipt text parsing using Gemini...");

  try {
    const prompt = `You are a receipt parsing expert. Analyze this RAW OCR TEXT and extract information in JSON format:
{
  "amount": <the actual total cost to be paid, excluding cash paid/change>,
  "currency": <string>,
  "date": <YYYY-MM-DD>,
  "merchant": <string>,
  "category": <one of: cat_food, cat_transport, cat_shopping, cat_bills, cat_health, cat_entertainment, cat_education, cat_travel, cat_personal, cat_housing, cat_gifts, cat_investment, cat_savings, cat_business, cat_other_expense>,
  "items": [{"name": "<item name>", "quantity": <number>, "price": <number>}],
  "confidence": <0-100>
}
Rules:
- IGNORE "Tunai", "Cash", "Bayar", or "Total Bayar" if it refers to the money handed by the user.
- IGNORE "Kembalian" or "Change".
- Return ONLY valid JSON.

RAW OCR TEXT:
"""
${ocrText}
"""`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Safe parse even if model still includes markers
    const cleanedJson = text.includes("```")
      ? text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      : text.trim();
    const parsed = JSON.parse(cleanedJson) as GeminiReceiptResponse;

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
    throw new Error(`AI Text Parsing Error: ${errorMessage}`);
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

async function imageToBase64(imageUri: string): Promise<string> {
  try {
    return await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64"
    });
  } catch (error) {
    throw new Error(
      `Failed to convert image to base64: ${(error as Error).message}`
    );
  }
}

export function isGeminiAvailable(): boolean {
  return !!API_KEY;
}
