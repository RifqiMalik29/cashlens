import { type Transaction } from "@types";

import { api } from "./apiClient";

interface TransactionCategory {
  id: string;
  name: string;
  name_key: string | null;
  is_default: boolean;
  type: "income" | "expense";
  icon: string;
  color: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionResponse {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string;
  date: string;
  transaction_date?: string;
  created_at: string;
  updated_at: string;
  category?: TransactionCategory | null;
}

interface PaginatedTransactionResponse {
  transactions: TransactionResponse[];
  total: number;
  limit: number;
  offset: number;
}

interface SummaryResponse {
  total_income: number;
  total_expense: number;
  net_balance: number;
  by_category: {
    category_id: string;
    category_name: string;
    type: "income" | "expense";
    total: number;
  }[];
}

export const transactionService = {
  getTransactions: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<TransactionResponse[]> => {
    const parts = [];
    if (params?.limit !== undefined) parts.push(`limit=${params.limit}`);
    if (params?.offset !== undefined) parts.push(`offset=${params.offset}`);
    const query = parts.length ? `?${parts.join("&")}` : "";
    const endpoint = `/api/v1/transactions${query}`;
    const res = await api.get<PaginatedTransactionResponse>(endpoint);
    return res.transactions ?? [];
  },

  createTransaction: async (
    data: Partial<Transaction>
  ): Promise<TransactionResponse> => {
    if (data.categoryId !== null && data.categoryId !== undefined) {
      const isValidUuid = /^[0-9a-f-]{36}$/i.test(data.categoryId);
      if (!isValidUuid) {
        throw new Error(
          `Invalid category ID: ${data.categoryId}. Please log out and back in to refresh categories.`
        );
      }
    }
    const payload = {
      category_id: data.categoryId,
      amount: data.amount,
      currency: data.currency ?? "IDR",
      type: data.type ?? "expense",
      description: data.note || "",
      transaction_date: data.date
        ? data.date.split("T")[0] + "T00:00:00Z"
        : new Date().toISOString().split("T")[0] + "T00:00:00Z"
    };

    return api.post<TransactionResponse>("/api/v1/transactions", payload);
  },

  updateTransaction: async (
    id: string,
    data: Partial<Transaction>
  ): Promise<TransactionResponse> => {
    const payload = {
      category_id: data.categoryId,
      amount: data.amount,
      currency: data.currency ?? "IDR",
      description: data.note || "",
      transaction_date: data.date
        ? data.date.split("T")[0] + "T00:00:00Z"
        : new Date().toISOString().split("T")[0] + "T00:00:00Z"
    };
    return api.put<TransactionResponse>(`/api/v1/transactions/${id}`, payload);
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/transactions/${id}`);
  },

  getSummary: async (month?: string): Promise<SummaryResponse> => {
    const endpoint = `/api/v1/transactions/summary${month ? `?month=${month}` : ""}`;
    return api.get<SummaryResponse>(endpoint);
  }
};
