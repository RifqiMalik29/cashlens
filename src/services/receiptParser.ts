/* eslint-disable max-lines */
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";

import { type Transaction } from "../types";
import { isGeminiAvailable, parseReceiptImage } from "./gemini";
import { recognizeText } from "./ocr";

const logger = createLogger("[ReceiptParser]");

export interface ProcessingResult {
  data: Partial<Transaction>;
  method: "local_ocr" | "gemini_text" | "gemini_vision";
  confidence: number;
}

interface ParsedReceiptData {
  amount?: number;
  categoryId?: string;
  date?: string;
  note?: string;
  time?: string;
  locale?: string;
}

interface LocaleConfig {
  code: string;
  language: "id" | "en";
  currency: string;
  thousandSeparator: string;
  decimalSeparator: string;
  monthNames: Record<string, number>;
  currencyPatterns: RegExp[];
  datePatterns: RegExp[];
}

const LOCALES: Record<string, LocaleConfig> = {
  "id-ID": {
    code: "id-ID",
    language: "id",
    currency: "IDR",
    thousandSeparator: ".",
    decimalSeparator: ",",
    monthNames: {
      jan: 0,
      januari: 0,
      feb: 1,
      februari: 1,
      mar: 2,
      maret: 2,
      apr: 3,
      april: 3,
      mei: 4,
      jun: 5,
      juni: 5,
      jul: 6,
      juli: 6,
      agu: 7,
      agustus: 7,
      sep: 8,
      september: 8,
      okt: 9,
      oktober: 9,
      nov: 10,
      november: 10,
      des: 11,
      desember: 11
    },
    currencyPatterns: [
      /Rp\s*([\d.,]+)/i,
      /IDR\s*([\d.,]+)/i,
      /TOTAL\s+[:\s]*Rp\s*([\d.,]+)/i,
      /JUMLAH\s+[:\s]*Rp\s*([\d.,]+)/i,
      /PEMBAYARAN\s+[:\s]*Rp\s*([\d.,]+)/i
    ],
    datePatterns: [
      /(\d{1,2}\s+(?:jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)[a-z]*\s+\d{4})/i,
      /(\d{2}[-/]\d{2}[-/]\d{4})/,
      /(\d{2}[-/]\d{2}[-/]\d{2})/
    ]
  },
  "en-US": {
    code: "en-US",
    language: "en",
    currency: "USD",
    thousandSeparator: ",",
    decimalSeparator: ".",
    monthNames: {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11
    },
    currencyPatterns: [
      /\$([\d.,]+)/i,
      /USD\s*([\d.,]+)/i,
      /TOTAL\s+[:\$]*\s*([\d.,]+)/i,
      /AMOUNT\s+[:\$]*\s*([\d.,]+)/i
    ],
    datePatterns: [
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
      /(\d{1,2}[-/]\d{1,2}[-/]\d{4})/
    ]
  }
};

const BANK_LABELS = [
  /PEMBAYARAN\s+KE\s*:\s*(.+)/i,
  /PEMBAYARAN\s+KEPADA\s*:\s*(.+)/i,
  /PENERIMA\s*:\s*(.+)/i,
  /KEPADA\s*:\s*(.+)/i,
  /UNTUK\s*:\s*(.+)/i,
  /DESCRIPTION\s*:\s*(.+)/i
];
const TIME_PATTERN = /(\d{2}:\d{2}(?::\d{2})?)/;

/**
 * Main intelligence cascade for receipt processing
 */
export async function processReceiptIntelligence(
  imageUri: string,
  onStatusUpdate?: (status: string) => void
): Promise<ProcessingResult> {
  const { subscriptionTier, stealthScansUsed, incrementStealthScans } =
    useAuthStore.getState();
  const geminiReady = isGeminiAvailable();

  const isPremium = subscriptionTier === "premium";
  const hasStealthTrial = subscriptionTier === "free" && stealthScansUsed < 5;

  // STAGE 1: Fast Lane for Premium OR Stealth Trial
  if ((isPremium || hasStealthTrial) && geminiReady) {
    if (hasStealthTrial) {
      logger.debug(`[StealthTrial] Using magic scan ${stealthScansUsed + 1}/5`);
      incrementStealthScans();
    }

    onStatusUpdate?.("Menganalisis dengan Vision AI Pro...");
    try {
      const result = await parseReceiptImage(imageUri);
      return {
        data: {
          amount: result.amount,
          amountInBaseCurrency: result.amount,
          categoryId: result.category,
          date: `${result.date}T${result.time || "12:00:00"}`,
          note: result.merchant,
          isFromScan: true
        },
        method: "gemini_vision",
        confidence: result.confidence
      };
    } catch (e) {
      logger.warn("Vision AI failed, falling back to OCR cascade", e);
    }
  }

  // STAGE 2: Local OCR (Cheap & Fast)
  onStatusUpdate?.("Membaca teks struk...");
  const rawText = await recognizeText(imageUri);
  const localResult = parseReceipt(rawText);

  if (localResult.amount && localResult.amount > 0 && localResult.note) {
    logger.debug("✓ Local OCR success, skipping Gemini");
    return {
      data: {
        amount: localResult.amount,
        amountInBaseCurrency: localResult.amount,
        categoryId: localResult.categoryId,
        date: localResult.date || new Date().toISOString(),
        note: localResult.note,
        isFromScan: true
      },
      method: "local_ocr",
      confidence: 85
    };
  }

  // STAGE 3: Final Vision Fallback (The "Superpower")
  if (geminiReady) {
    onStatusUpdate?.("Menganalisis gambar secara mendalam...");
    const result = await parseReceiptImage(imageUri);
    return {
      data: {
        amount: result.amount,
        amountInBaseCurrency: result.amount,
        categoryId: result.category,
        date: `${result.date}T${result.time || "12:00:00"}`,
        note: result.merchant,
        isFromScan: true
      },
      method: "gemini_vision",
      confidence: result.confidence
    };
  }

  // STAGE 5: Absolute Fallback
  return {
    data: {
      amount: localResult.amount || 0,
      amountInBaseCurrency: localResult.amount || 0,
      categoryId: localResult.categoryId || "cat_other_expense",
      date: localResult.date || new Date().toISOString(),
      note: localResult.note,
      isFromScan: true
    },
    method: "local_ocr",
    confidence: localResult.amount ? 50 : 10
  };
}

export function detectLocale(text: string): string {
  const textLower = text.toLowerCase();
  const idKeywords = [
    "rp",
    "idr",
    "total pembayaran",
    "jumlah",
    "tunai",
    "maret"
  ];
  const enKeywords = ["$", "usd", "total", "amount", "cash", "change"];
  let idScore = 0;
  let enScore = 0;
  for (const k of idKeywords) if (textLower.includes(k)) idScore++;
  for (const k of enKeywords) if (textLower.includes(k)) enScore++;
  return idScore >= enScore ? "id-ID" : "en-US";
}

function getLocaleConfig(locale: string): LocaleConfig {
  return LOCALES[locale] || LOCALES["id-ID"];
}

function normalizeAmount(rawAmount: string, _locale: string): number {
  let cleaned = rawAmount.trim().replace(/[^0-9.,]/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const lastDot = cleaned.lastIndexOf(".");
    const lastComma = cleaned.lastIndexOf(",");
    if (lastDot > lastComma) cleaned = cleaned.replace(/,/g, "");
    else cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }
  const amount = parseFloat(cleaned);
  return isNaN(amount) ? 0 : amount;
}

function parseAmountWithLocale(
  text: string,
  _locale: string
): number | undefined {
  const config = getLocaleConfig(_locale);
  for (const pattern of config.currencyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = normalizeAmount(match[1], _locale);
      if (amount > 0) return amount;
    }
  }
  return undefined;
}

function parseDateWithLocale(
  text: string,
  _locale: string
): string | undefined {
  const timeMatch = text.match(TIME_PATTERN);
  const match = text.match(/(\d{2}[-/]\d{2}[-/]\d{4})/);
  if (match) {
    const date = new Date(match[0]);
    if (!isNaN(date.getTime())) {
      return (
        date.toISOString().split("T")[0] +
        "T" +
        (timeMatch ? timeMatch[0] : "12:00")
      );
    }
  }
  return undefined;
}

function detectCategory(_text: string): string {
  return "cat_other_expense";
}

function parseStoreName(text: string): string | undefined {
  for (const labelPattern of BANK_LABELS) {
    const match = text.match(labelPattern);
    if (match && match[1]) return match[1].trim().substring(0, 50);
  }
  return undefined;
}

export function parseReceipt(text: string): ParsedReceiptData {
  const locale = detectLocale(text);
  return {
    amount: parseAmountWithLocale(text, locale),
    categoryId: detectCategory(text),
    date: parseDateWithLocale(text, locale),
    note: parseStoreName(text),
    locale
  };
}

export function extractReceiptData(text: string): Partial<Transaction> {
  const parsed = parseReceipt(text);
  return {
    amount: parsed.amount || 0,
    amountInBaseCurrency: parsed.amount || 0,
    categoryId: parsed.categoryId || "cat_other_expense",
    date: parsed.date || new Date().toISOString(),
    note: parsed.note,
    isFromScan: true
  };
}
