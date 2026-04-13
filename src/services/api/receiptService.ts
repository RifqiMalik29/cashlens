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

export const receiptService = {
  scanReceipt: async (imageUri: string): Promise<ScanResponse> => {
    const { accessToken } = useAuthStore.getState();

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "receipt.jpg"
    } as unknown as Blob);

    const response = await fetch(`${BASE_URL}/api/v1/receipts/scan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      const err = json as Record<string, string> | null;
      throw new Error(err?.message || err?.error || `HTTP ${response.status}`);
    }

    return (json as { data: ScanResponse }).data;
  }
};
