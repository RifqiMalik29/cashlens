import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { File } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const LOG_PREFIX = "[GeminiAI]";
const CACHE_PREFIX = "gemini_cache_v1:";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    `${LOG_PREFIX} Missing EXPO_PUBLIC_GEMINI_API_KEY in .env.local`
  );
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
  // eslint-disable-next-line no-console
  console.log(
    `${LOG_PREFIX} Starting receipt parsing using model: gemini-3.1-flash-lite-preview (Vision)...`
  );

  try {
    const file = new File(imageUri);
    const info = await file.info({ md5: true });
    const cacheKey = info.exists ? `${CACHE_PREFIX}${info.md5}` : null;

    if (cacheKey) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        // eslint-disable-next-line no-console
        console.log(`${LOG_PREFIX} ✓ Using CACHED result for this image!`);
        return JSON.parse(cachedData);
      }
    }

    const compressedImage = await compressImage(imageUri);
    const base64Image = await imageToBase64(compressedImage);

    // eslint-disable-next-line no-console
    console.log(
      `${LOG_PREFIX} Sending image to Gemini... (Base64 length: ${base64Image.length})`
    );

    const prompt = `You are a receipt parsing expert. Analyze this receipt image and extract information in JSON format:
{
  "amount": <total amount as number>,
  "currency": <currency code like IDR, USD, etc>,
  "date": <date in YYYY-MM-DD format>,
  "merchant": <store name>,
  "category": <one of: cat_food, cat_transport, cat_shopping, cat_bills, cat_health, cat_entertainment, cat_education, cat_travel, cat_personal, cat_housing, cat_gifts, cat_investment, cat_savings, cat_business, cat_other_expense>,
  "items": [{"name": "<item name>", "quantity": <qty>, "price": <price>}],
  "confidence": <0-100 confidence score>
}
Rules:
- Return ONLY valid JSON.
- Use Indonesian context (Rp = IDR).`;

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
  // eslint-disable-next-line no-console
  console.log(`${LOG_PREFIX} Starting receipt text parsing using Gemini...`);

  try {
    const prompt = `You are a receipt parsing expert. Analyze this RAW OCR TEXT and extract information in JSON format:
{
  "amount": <number>,
  "currency": <string>,
  "date": <YYYY-MM-DD>,
  "merchant": <string>,
  "category": <one of: cat_food, cat_transport, cat_shopping, cat_bills, cat_health, cat_entertainment, cat_education, cat_travel, cat_personal, cat_housing, cat_gifts, cat_investment, cat_savings, cat_business, cat_other_expense>,
  "items": [{"name": "<item name>", "quantity": <number>, "price": <number>}],
  "confidence": <0-100>
}
Rules:
- Input is raw text from OCR, might have typos.
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
    // eslint-disable-next-line no-console
    console.error(
      `${LOG_PREFIX} Image compression failed, using original image. Error: ${(error as Error).message}`
    );
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
