import { api } from "./apiClient";

export interface DraftResponse {
  id: string;
  user_id: string;
  source: "telegram" | "receipt_scan" | "manual";
  status: "pending" | "confirmed" | "rejected";
  fields: Record<string, unknown>;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ConfirmDraftPayload {
  category_id: string;
  amount: number;
  currency?: string;
  description?: string;
  transaction_date: string;
}

export const draftService = {
  createDraft: async (data: {
    source: string;
    currency: string;
    fields: Record<string, unknown>;
  }): Promise<DraftResponse> => {
    return api.post<DraftResponse>("/api/v1/drafts", data);
  },

  getDrafts: async (
    status?: "pending" | "confirmed" | "rejected"
  ): Promise<DraftResponse[]> => {
    const query = status ? `?status=${status}` : "";
    return api.get<DraftResponse[]>(`/api/v1/drafts${query}`);
  },

  deleteDraft: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/drafts/${id}`);
  },

  confirmDraft: async (
    id: string,
    payload: ConfirmDraftPayload
  ): Promise<void> => {
    await api.post(`/api/v1/drafts/${id}/confirm`, payload);
  }
};
