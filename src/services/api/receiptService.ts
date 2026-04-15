import { useAuthStore } from "@stores/useAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export interface ScanResponse {
  amount: number;
  currency: string;
  merchant: string;
  date: string;
  category_id: string;
  confidence: number;
  items?: {
    name: string;
    price: number;
  }[];
}

export interface ScanReceiptOptions {
  imageUri: string;
  ocrText?: string; // Optional OCR text extracted locally for fallback
}

export const receiptService = {
  scanReceipt: async (
    imageUriOrOptions: string | ScanReceiptOptions
  ): Promise<ScanResponse> => {
    const { accessToken } = useAuthStore.getState();

    // Support both old signature (string) and new signature (object)
    const imageUri =
      typeof imageUriOrOptions === "string"
        ? imageUriOrOptions
        : imageUriOrOptions.imageUri;
    const ocrText =
      typeof imageUriOrOptions === "object"
        ? imageUriOrOptions.ocrText
        : undefined;

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "receipt.jpg"
    } as unknown as Blob);

    // Add optional OCR text fallback if provided
    if (ocrText) {
      formData.append("ocr_text", ocrText);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout to be safe

    try {
      const response = await fetch(`${BASE_URL}/api/v1/receipts/scan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData,
        signal: controller.signal
      });

      let json: unknown;
      try {
        json = await response.json();
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        const err = json as Record<string, string> | null;
        throw new Error(
          err?.message ||
            err?.error ||
            `Gagal memindai (HTTP ${response.status})`
        );
      }

      const responseData = json as { data: ScanResponse };
      return responseData.data;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new Error(
          "Permintaan waktu habis. AI sedang sibuk, silakan coba lagi."
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
