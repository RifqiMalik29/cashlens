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
    const res = await api.get<{ data: SubscriptionData }>(
      "/api/v1/subscription"
    );
    return res.data;
  },

  createInvoice: async (
    plan: CreateInvoiceRequest["plan"]
  ): Promise<CreateInvoiceResponse> => {
    const res = await api.post<{ data: CreateInvoiceResponse }>(
      "/api/v1/payments/create-invoice",
      { plan }
    );
    return res.data;
  }
};
