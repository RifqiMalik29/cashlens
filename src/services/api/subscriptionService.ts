import { api } from "./apiClient";

export interface SubscriptionData {
  tier: "free" | "premium";
  expires_at: string | null;
  quota: {
    transactions_used: number;
    transactions_limit: number | null;
    scans_used: number;
    scans_limit: number | null;
  };
}

export interface CreateInvoiceRequest {
  plan: "monthly" | "annual" | "founder_annual";
}

export interface CreateInvoiceResponse {
  payment_url: string;
  invoice_id: string;
  expires_at: string;
}

export const subscriptionService = {
  getSubscription: async (): Promise<SubscriptionData> => {
    return await api.get<SubscriptionData>("/api/v1/subscription");
  },

  createInvoice: async (
    plan: CreateInvoiceRequest["plan"]
  ): Promise<CreateInvoiceResponse> => {
    return await api.post<CreateInvoiceResponse>(
      "/api/v1/payments/create-invoice",
      { plan }
    );
  },

  verifySubscription: async (invoiceId: string): Promise<void> => {
    await api.post("/api/v1/subscription/verify", { invoice_id: invoiceId });
  }
};
