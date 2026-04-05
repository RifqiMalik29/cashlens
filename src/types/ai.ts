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
