# AI Receipt Scanner Implementation Guide

## Overview

This guide walks you through implementing **Google Gemini 2.0 Flash** to power an AI-driven receipt scanner for CashLens. The AI will process receipt images directly and return structured JSON data, replacing the current regex-based parser.

**What You'll Build:**

- Direct image-to-JSON receipt parsing using Gemini 2.0 Flash
- Hybrid fallback system (AI → OCR → Regex) for offline scenarios
- Loading states, error handling, and rate limit management
- Portfolio-ready AI integration with clean architecture

**Why Gemini 2.0 Flash:**

- ✅ **Free tier**: 1,500 requests/day, 15 RPM
- ✅ **Vision capabilities**: Process images directly (no separate OCR needed)
- ✅ **Multi-language**: Handles Indonesian & English receipts
- ✅ **Structured output**: Returns clean JSON
- ✅ **Fast**: ~1-3 seconds response time
- ✅ **No credit card required** to start

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Setup Google AI Studio](#2-step-1-setup-google-ai-studio)
3. [Step 2: Install Dependencies](#3-step-2-install-dependencies)
4. [Step 3: Configure Environment Variables](#4-step-3-configure-environment-variables)
5. [Step 4: Create Gemini Service](#5-step-4-create-gemini-service)
6. [Step 5: Define AI Response Types](#6-step-5-define-ai-response-types)
7. [Step 6: Create Prompt Template](#7-step-6-create-prompt-template)
8. [Step 7: Update Scanner Screen](#8-step-7-update-scanner-screen)
9. [Step 8: Add Loading & Error States](#9-step-8-add-loading--error-states)
10. [Step 9: Implement Hybrid Fallback](#10-step-9-implement-hybrid-fallback)
11. [Step 10: Add Rate Limit Handling](#11-step-10-add-rate-limit-handling)
12. [Step 11: Test with Real Receipts](#12-step-11-test-with-real-receipts)
13. [Step 12: Optimize for Production](#13-step-12-optimize-for-production)
14. [Troubleshooting](#14-troubleshooting)
15. [Future Enhancements](#15-future-enhancements)

---

## 1. Prerequisites

Before starting, ensure you have:

- ✅ CashLens project running (Expo SDK 54+)
- ✅ Working camera & image picker (already implemented)
- ✅ Node.js 18+ and pnpm installed
- ✅ Google account (for AI Studio)
- ✅ Basic understanding of async/await and API calls

**Current Stack You'll Modify:**

- `src/services/ocr.ts` - ML Kit OCR (keep as fallback)
- `src/services/receiptParser.ts` - Regex parser (replace with AI)
- `src/screens/Scanner/ScannerScreen.tsx` - Scanner UI
- `src/screens/Scanner/useScannerScreen.ts` - Scanner logic

---

## 2. Step 1: Setup Google AI Studio

### 2.1 Create Google AI Studio Account

1. Visit: **https://aistudio.google.com/**
2. Sign in with your Google account
3. Click **"Get API key"** in the left sidebar
4. Click **"Create API key in new project"**
5. Copy your API key (starts with `AIza...`)

### 2.2 Understand Free Tier Limits

| Model            | RPM | RPD   | TPM       | Context Window |
| ---------------- | --- | ----- | --------- | -------------- |
| Gemini 2.0 Flash | 15  | 1,500 | 1,000,000 | 1M tokens      |
| Gemini 2.5 Flash | 10  | 250   | 250,000   | 1M tokens      |

**For portfolio use:** 1,500 scans/day is more than enough!

### 2.3 API Key Security

- ✅ Store in `.env.local` (already gitignored)
- ✅ Never commit to GitHub
- ✅ Rotate if exposed publicly

---

## 3. Step 2: Install Dependencies

Run this command in your project root:

```bash
pnpm add @google/generative-ai
```

**What this installs:**

- Official Google Gemini SDK for JavaScript
- Image processing utilities
- Type definitions included

**Verify installation:**

```bash
pnpm list @google/generative-ai
```

Expected output: `@google/generative-ai@0.x.x`

---

## 4. Step 3: Configure Environment Variables

### 4.1 Update `.env.local`

Add this line to your existing `.env.local` file:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://cuqoqayibifuiaitnciv.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Eb5Cb09bEIqXBeswBlWefA_idMg4bBv
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key from Step 1.

### 4.2 Restart Expo Dev Server

After updating `.env.local`, restart:

```bash
pnpm start
```

Press `r` to reload the app.

---

## 5. Step 4: Create Gemini Service

Create a new file: `src/services/gemini.ts`

This service handles all AI interactions.

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Platform } from "react-native";

const LOG_PREFIX = "[GeminiAI]";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    `${LOG_PREFIX} Missing EXPO_PUBLIC_GEMINI_API_KEY in .env.local`
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    temperature: 0.1,
    responseMimeType: "application/json",
    responseMimeType: "application/json"
  }
});

interface GeminiReceiptResponse {
  amount: number;
  currency: string;
  date: string;
  time?: string;
  merchant: string;
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod?: string;
  confidence: number;
}

export async function parseReceiptImage(
  imageUri: string
): Promise<GeminiReceiptResponse> {
  console.log(`${LOG_PREFIX} Starting receipt parsing...`);
  console.log(`${LOG_PREFIX} Image URI: ${imageUri}`);

  try {
    const base64Image = await imageToBase64(imageUri);

    console.log(`${LOG_PREFIX} Sending image to Gemini...`);

    const prompt = `You are a receipt parsing expert. Analyze this receipt image and extract the following information in JSON format:

{
  "amount": <total amount as number>,
  "currency": <currency code like IDR, USD, etc>,
  "date": <date in YYYY-MM-DD format>,
  "time": <time in HH:mm format if available, optional>,
  "merchant": <store/merchant name>,
  "category": <one of: cat_food, cat_transport, cat_shopping, cat_bills, cat_health, cat_entertainment, cat_education, cat_travel, cat_personal, cat_housing, cat_gifts, cat_investment, cat_savings, cat_business, cat_other_expense>,
  "items": [{"name": "<item name>", "quantity": <qty>, "price": <price>}],
  "paymentMethod": <cash/card if visible, optional>,
  "confidence": <0-100 confidence score>
}

Rules:
- If amount is not found, use 0
- If date is not found, use today's date
- If merchant is not found, use "Unknown Merchant"
- Choose the most appropriate category based on merchant name and items
- If no items are visible, return empty array
- Return ONLY valid JSON, no explanations
- Use Indonesian context (Rp = IDR, etc)`;

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

    console.log(`${LOG_PREFIX} Raw response:`, text);

    const parsed = JSON.parse(text) as GeminiReceiptResponse;

    console.log(`${LOG_PREFIX} Parsed successfully!`);
    console.log(`${LOG_PREFIX} Amount: ${parsed.amount}`);
    console.log(`${LOG_PREFIX} Merchant: ${parsed.merchant}`);
    console.log(`${LOG_PREFIX} Category: ${parsed.category}`);
    console.log(`${LOG_PREFIX} Confidence: ${parsed.confidence}%`);

    return parsed;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error:`, (error as Error).message);
    throw new Error("Failed to parse receipt with AI");
  }
}

async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Base64 conversion failed:`, error);
    throw new Error("Failed to convert image to base64");
  }
}

export function isGeminiAvailable(): boolean {
  return !!API_KEY;
}
```

**Key Features:**

- ✅ Direct image processing (no OCR needed)
- ✅ JSON-only response mode (structured output)
- ✅ Low temperature for consistent results
- ✅ Confidence scoring
- ✅ Comprehensive error handling

---

## 6. Step 5: Define AI Response Types

Create or update types file: `src/types/ai.ts`

```typescript
export interface AIParsedReceipt {
  amount: number;
  currency: string;
  date: string;
  time?: string;
  merchant: string;
  category: string;
  items: ReceiptItem[];
  paymentMethod?: string;
  confidence: number;
  parseMethod: "ai" | "ocr_regex";
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ScannerAIState {
  isProcessing: boolean;
  error: string | null;
  isOffline: boolean;
  rateLimitExceeded: boolean;
  fallbackActive: boolean;
}
```

---

## 7. Step 6: Create Prompt Template

The prompt is already included in `src/services/gemini.ts` (Step 4), but here's how to customize it:

### Prompt Structure

```typescript
const prompt = `
  [ROLE] You are a receipt parsing expert.
  
  [TASK] Analyze this receipt image and extract structured data.
  
  [OUTPUT FORMAT] JSON with specific schema.
  
  [RULES]
  - Handle missing fields gracefully
  - Use Indonesian context
  - Return ONLY valid JSON
`;
```

### Customization Tips

**For better Indonesian receipt handling:**

```typescript
const prompt = `...

Additional Indonesian context:
- "Rp" or "IDR" = Indonesian Rupiah
- "Total" or "Jumlah" or "Grand Total" = total amount
- "Tunai" = Cash, "Kartu" = Card
- Common merchants: ALFAMART, INDOMARET, STARBUCKS, etc
- Date formats: DD/MM/YYYY or DD-MM-YYYY
`;
```

**For itemized receipts:**

```typescript
const prompt = `...

For each item, extract:
- Item name (full text as shown)
- Quantity (if shown)
- Unit price or total price for that item
`;
```

---

## 8. Step 7: Update Scanner Screen

### 8.1 Update `useScannerScreen.ts`

Modify the hook to integrate AI parsing:

```typescript
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useRef, useState } from "react";
import { parseReceiptImage } from "@services/gemini";
import { extractReceiptData } from "@services/receiptParser";
import { recognizeText } from "@services/ocr";
import { useTransactionStore } from "@stores/useTransactionStore";

export function useScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const requestPermissionHandler = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
    setCameraError(false);
  }, []);

  const handleCameraError = useCallback(() => {
    setCameraError(true);
    setCameraReady(false);
    setError("Camera encountered an error. Please refresh.");
  }, []);

  const handleRefreshCamera = useCallback(() => {
    setCameraError(false);
    setCameraReady(false);
    setError(null);
  }, []);

  const processImageWithAI = useCallback(
    async (imageUri: string) => {
      setIsScanning(true);
      setError(null);

      try {
        let parsedData;

        try {
          console.log("[Scanner] Attempting AI parsing...");
          parsedData = await parseReceiptImage(imageUri);
          console.log("[Scanner] AI parsing successful");
        } catch (aiError) {
          console.warn(
            "[Scanner] AI failed, falling back to OCR:",
            (aiError as Error).message
          );

          console.log("[Scanner] Running OCR...");
          const ocrText = await recognizeText(imageUri);

          if (!ocrText || ocrText.trim().length === 0) {
            throw new Error("No text detected in image");
          }

          console.log("[Scanner] Parsing with regex...");
          const regexData = extractReceiptData(ocrText);
          parsedData = {
            amount: regexData.amount || 0,
            currency: "IDR",
            date: regexData.date || new Date().toISOString(),
            merchant: regexData.note || "Unknown",
            category: regexData.categoryId || "cat_other_expense",
            items: [],
            confidence: 50,
            parseMethod: "ocr_regex" as const
          };
        }

        const transaction = {
          id: crypto.randomUUID(),
          amount: parsedData.amount,
          currency: parsedData.currency,
          amountInBaseCurrency: parsedData.amount,
          exchangeRate: 1,
          type: "expense" as const,
          categoryId: parsedData.category,
          note: parsedData.merchant,
          date: parsedData.date,
          receiptImageUri: imageUri,
          isFromScan: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        addTransaction(transaction);

        setIsScanning(false);

        navigation.navigate("(tabs)", {
          screen: "transactions"
        });
      } catch (err) {
        console.error("[Scanner] Processing failed:", err);
        setError((err as Error).message || "Failed to process receipt");
        setIsScanning(false);
      }
    },
    [addTransaction, navigation]
  );

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current || isScanning) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false
      });

      if (photo?.uri) {
        await processImageWithAI(photo.uri);
      }
    } catch (error) {
      console.error("[Scanner] Photo capture failed:", error);
      setError("Failed to capture photo");
    }
  }, [isScanning, processImageWithAI]);

  const handlePickFromGallery = useCallback(async () => {
    if (isScanning) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: false
      });

      if (!result.canceled && result.assets[0]?.uri) {
        await processImageWithAI(result.assets[0].uri);
      }
    } catch (error) {
      console.error("[Scanner] Gallery pick failed:", error);
      setError("Failed to pick image");
    }
  }, [isScanning, processImageWithAI]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    cameraRef,
    permission,
    requestPermissionHandler,
    isFocused: true,
    isScanning,
    error,
    flashEnabled,
    cameraReady,
    cameraError,
    isOffline,
    handleTakePhoto,
    handlePickFromGallery,
    toggleFlash,
    dismissError,
    handleCameraReady,
    handleCameraError,
    handleRefreshCamera
  };
}
```

**Key Changes:**

- ✅ Added `processImageWithAI` function
- ✅ Hybrid fallback: AI → OCR → Regex
- ✅ Auto-navigation after successful scan
- ✅ Better error handling

---

## 9. Step 8: Add Loading & Error States

### 9.1 Create AI Processing Indicator

Create: `src/components/scanner/AIProcessingIndicator.tsx`

```typescript
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

interface AIProcessingIndicatorProps {
  isProcessing: boolean;
  stage?: "capturing" | "analyzing" | "extracting";
}

export function AIProcessingIndicator({
  isProcessing,
  stage = "analyzing"
}: AIProcessingIndicatorProps) {
  const [dots, setDots] = useState("");
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    if (!isProcessing) return;

    scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1
    );
  }, [isProcessing, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (!isProcessing) return null;

  const stageText = {
    capturing: "Capturing receipt",
    analyzing: "Analyzing with AI",
    extracting: "Extracting data"
  };

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/80">
      <Animated.View
        className="h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
        style={animatedStyle}
      >
        <ActivityIndicator size="large" color="#4CAF82" />
      </Animated.View>

      <Text className="mt-4 text-lg font-semibold text-white">
        {stageText[stage]}{dots}
      </Text>

      <Text className="mt-2 text-sm text-gray-400">
        This may take a few seconds
      </Text>
    </View>
  );
}
```

### 9.2 Update ScannerScreen.tsx

Add the AI processing indicator to your scanner screen:

```typescript
import { AIProcessingIndicator } from "@components/scanner/AIProcessingIndicator";

// Inside your ScannerScreen component:

<AIProcessingIndicator
  isProcessing={isScanning}
  stage={isScanning ? "analyzing" : "capturing"}
/>
```

---

## 10. Step 9: Implement Hybrid Fallback

The hybrid approach is already implemented in Step 8 (`useScannerScreen.ts`), but here's the architecture:

### Fallback Flow

```
1. Try AI (Gemini)
   ↓ Success → Return parsed data
   ↓ Fail
2. Try OCR (ML Kit)
   ↓ Success → Parse with regex
   ↓ Fail
3. Show error to user
```

### Benefits

- ✅ **AI-first**: Best accuracy when online
- ✅ **OCR fallback**: Works offline with existing regex
- ✅ **No data loss**: Always attempts parsing
- ✅ **Graceful degradation**: User always gets a result

### Implementation Notes

The fallback is handled in the `try-catch` block:

```typescript
try {
  // Try AI first
  parsedData = await parseReceiptImage(imageUri);
} catch (aiError) {
  // Fallback to OCR + regex
  const ocrText = await recognizeText(imageUri);
  const regexData = extractReceiptData(ocrText);
  // ... convert to same format
}
```

---

## 11. Step 10: Add Rate Limit Handling

Gemini free tier has limits. Handle them gracefully:

### 11.1 Update Gemini Service

Add rate limit detection to `src/services/gemini.ts`:

```typescript
export class GeminiRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiRateLimitError";
  }
}

export async function parseReceiptImage(
  imageUri: string
): Promise<GeminiReceiptResponse> {
  // ... existing code ...

  try {
    const result = await model.generateContent([...]);

    // ... existing code ...
  } catch (error) {
    const errorMessage = (error as Error).message;

    // Check for rate limit errors
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("quota")
    ) {
      throw new GeminiRateLimitError(
        "AI rate limit exceeded. Using fallback OCR."
      );
    }

    throw new Error("Failed to parse receipt with AI");
  }
}
```

### 11.2 Handle in Scanner Hook

Update the catch block in `useScannerScreen.ts`:

```typescript
import { GeminiRateLimitError } from "@services/gemini";

// Inside processImageWithAI:

try {
  parsedData = await parseReceiptImage(imageUri);
} catch (aiError) {
  if (aiError instanceof GeminiRateLimitError) {
    console.warn("[Scanner] Rate limit hit, using OCR fallback");
    setIsOffline(true);
  }

  // Continue with OCR fallback...
}
```

### 11.3 Show Rate Limit Warning

Add a banner when fallback is active:

```typescript
{isOffline && (
  <View className="absolute top-20 left-4 right-4 rounded-lg bg-yellow-500/90 p-3">
    <Text className="text-center text-sm font-medium text-white">
      AI temporarily unavailable. Using offline OCR instead.
    </Text>
  </View>
)}
```

---

## 12. Step 11: Test with Real Receipts

### 12.1 Test Scenarios

Test with these receipt types:

| Receipt Type               | Expected Result                        | Test Status |
| -------------------------- | -------------------------------------- | ----------- |
| **Alfamart/Indomaret**     | ✅ Accurate amount, merchant, category | ☐           |
| **Restaurant bill**        | ✅ Items, total, date                  | ☐           |
| **Handwritten receipt**    | ⚠️ May have lower accuracy             | ☐           |
| **Blurry photo**           | ⚠️ Fallback to OCR                     | ☐           |
| **Multi-item receipt**     | ✅ All items extracted                 | ☐           |
| **Non-Indonesian receipt** | ✅ Works with USD, etc                 | ☐           |
| **Very long receipt**      | ✅ Full extraction                     | ☐           |
| **Damaged/faded receipt**  | ⚠️ Partial extraction                  | ☐           |

### 12.2 Testing Checklist

```markdown
## AI Scanner Testing Checklist

### Basic Functionality

- [ ] Camera capture works
- [ ] Gallery selection works
- [ ] AI processing indicator shows
- [ ] Successful parse shows in transactions
- [ ] Navigation to transactions works

### AI Features

- [ ] Amount extracted correctly
- [ ] Merchant name extracted
- [ ] Date parsed correctly
- [ ] Category assigned appropriately
- [ ] Confidence score > 70%

### Fallback System

- [ ] OCR fallback works when AI fails
- [ ] Rate limit handled gracefully
- [ ] Offline mode works
- [ ] Error messages are clear

### Edge Cases

- [ ] Empty image shows error
- [ ] Non-receipt image handled
- [ ] Very large images compressed
- [ ] Network timeout handled

### Performance

- [ ] AI parsing < 5 seconds
- [ ] OCR fallback < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations
```

### 12.3 Debug Mode

Add debug logging during testing:

```typescript
// Add to .env.local
EXPO_PUBLIC_DEBUG_AI = true;

// In gemini.ts
const DEBUG = process.env.EXPO_PUBLIC_DEBUG_AI === "true";

if (DEBUG) {
  console.log(`${LOG_PREFIX} Full response:`, JSON.stringify(parsed, null, 2));
}
```

---

## 13. Step 12: Optimize for Production

### 13.1 Image Compression

Reduce upload time by compressing images:

```typescript
import * as ImageManipulator from "expo-image-manipulator";

async function compressImage(imageUri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1200 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
}
```

Install if needed:

```bash
npx expo install expo-image-manipulator
```

### 13.2 Caching

Cache AI results to avoid re-processing:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "gemini_cache:";

export async function getCachedResult(
  imageUri: string
): Promise<GeminiReceiptResponse | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${imageUri.split("/").pop()}`;
    const cached = await AsyncStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn("[GeminiAI] Cache read failed:", error);
  }

  return null;
}

export async function cacheResult(
  imageUri: string,
  result: GeminiReceiptResponse
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${imageUri.split("/").pop()}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (error) {
    console.warn("[GeminiAI] Cache write failed:", error);
  }
}
```

### 13.3 Usage Tracking

Track AI vs OCR usage for analytics:

```typescript
// In useScannerScreen.ts, after successful parse:

const parseMethod = parsedData.parseMethod || "ai";

// Track in Zustand or AsyncStorage
if (parseMethod === "ai") {
  incrementCounter("ai_scans");
} else {
  incrementCounter("ocr_scans");
}
```

### 13.4 Error Monitoring

Add error tracking for production:

```typescript
// Simple error logger (replace with Sentry/Crashlytics later)
export function logAIError(error: Error, context?: Record<string, any>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context
  };

  console.error("[GeminiAI] Error logged:", logEntry);

  // Store locally for later review
  AsyncStorage.getItem("ai_error_logs").then((logs) => {
    const errorLogs = logs ? JSON.parse(logs) : [];
    errorLogs.push(logEntry);

    // Keep only last 50 errors
    if (errorLogs.length > 50) {
      errorLogs.splice(0, errorLogs.length - 50);
    }

    AsyncStorage.setItem("ai_error_logs", JSON.stringify(errorLogs));
  });
}
```

---

## 14. Troubleshooting

### Common Issues

#### Issue 1: "Missing API Key" Error

**Problem:** App shows error about missing API key

**Solution:**

```bash
# 1. Check .env.local exists
cat .env.local

# 2. Verify key format
EXPO_PUBLIC_GEMINI_API_KEY=AIza...

# 3. Restart Expo completely
pnpm start --clear
```

---

#### Issue 2: "Failed to convert image to base64"

**Problem:** Base64 conversion fails

**Solution:**

- Check image URI is valid (starts with `file://` or `http://`)
- Add error handling for network images
- Try with a smaller image first

---

#### Issue 3: "Invalid JSON response"

**Problem:** Gemini returns non-JSON text

**Solution:**

```typescript
// Update prompt to be more strict
const prompt = `...

IMPORTANT: Return ONLY valid JSON. No explanations, no markdown, no code blocks.
Start with { and end with }`;

// Add JSON cleanup
const text = response.text();
const jsonMatch = text.match(/\{[\s\S]*\}/);
const cleanedJson = jsonMatch ? jsonMatch[0] : text;
const parsed = JSON.parse(cleanedJson);
```

---

#### Issue 4: Rate Limit Errors (429)

**Problem:** Too many requests

**Solution:**

- Free tier: 15 RPM, 1,500 RPD
- Add delay between requests if testing rapidly
- Implement exponential backoff:

```typescript
async function parseWithRetry(
  imageUri: string,
  retries = 3
): Promise<GeminiReceiptResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      return await parseReceiptImage(imageUri);
    } catch (error) {
      if (error instanceof GeminiRateLimitError && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`[GeminiAI] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Max retries exceeded");
}
```

---

#### Issue 5: Slow Response Time

**Problem:** AI parsing takes > 10 seconds

**Solution:**

- Compress image before sending (see Step 12.1)
- Check network connection
- Use `gemini-3.1-flash-lite-preview` (fastest with 500 RPD free tier)
- Add timeout:

```typescript
const result = await Promise.race([
  model.generateContent([...]),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 10000)
  )
]);
```

---

#### Issue 6: Incorrect Category Assignment

**Problem:** AI assigns wrong category

**Solution:**

- Add more examples to prompt:

```typescript
Category examples:
- ALFAMART, INDOMARET → cat_food
- GRAB, GOJEK → cat_transport
- STARBUCKS, KOPI KENANGAN → cat_food
- PLNs, PDAM → cat_bills
```

---

### Getting Help

- **Gemini API Docs:** https://ai.google.dev/docs
- **React Native Image Handling:** https://reactnative.dev/docs/image
- **CashLens Documentation:** Check `/docs` folder in project

---

## 15. Future Enhancements

Once the basic AI scanner is working, consider these upgrades:

### Phase 2: Smart Features

- [ ] **Learning System**: AI remembers your categorization preferences
- [ ] **Multi-Receipt Scan**: Process multiple receipts at once
- [ ] **Expense Predictions**: AI predicts monthly spending patterns
- [ ] **Anomaly Detection**: Flag unusual transactions
- [ ] **Smart Search**: "Show me all coffee expenses last month"

### Phase 3: Advanced AI

- [ ] **Budget Recommendations**: AI suggests budgets based on spending
- [ ] **Receipt Validation**: Detect fraudulent/duplicate receipts
- [ ] **Voice Notes**: Add voice descriptions to transactions
- [ ] **Smart Insights**: "You spend 30% more on weekends"
- [ ] **Auto-Categorization Rules**: Learn from manual corrections

### Phase 4: Portfolio Showcase

- [ ] **AI Accuracy Dashboard**: Show AI vs manual correction rates
- [ ] **Before/After Comparison**: Regex vs AI accuracy metrics
- [ ] **Usage Statistics**: "AI processed 500+ receipts"
- [ ] **Case Study Write-up**: Document your AI implementation journey

---

## Summary

You've now implemented a production-ready AI receipt scanner with:

✅ **Google Gemini 2.0 Flash** for image-to-JSON parsing
✅ **Hybrid fallback** system (AI → OCR → Regex)
✅ **Rate limit handling** with exponential backoff
✅ **Loading states** and error handling
✅ **Image compression** for performance
✅ **Caching** to reduce API calls
✅ **Testing framework** for validation
✅ **Error monitoring** for production

**Total Cost:** $0 (100% free tier)
**Portfolio Impact:** ⭐⭐⭐⭐⭐ (Shows modern AI integration skills)

---

## Next Steps

1. ✅ Follow Steps 1-4 to setup Gemini
2. ✅ Implement Steps 5-8 for core functionality
3. ✅ Test thoroughly with Step 11
4. ✅ Optimize with Step 12
5. 🚀 Deploy and showcase in your portfolio!

**Good luck with your AI-powered CashLens scanner!** 🎉
