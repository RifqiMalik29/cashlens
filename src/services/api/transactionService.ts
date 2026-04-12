import { type Transaction } from "@types";

import { api } from "./apiClient";

interface TransactionCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

interface TransactionResponse {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  category?: TransactionCategory;
}

interface SummaryResponse {
  period: string;
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
  by_category: {
    category_id: string;
    category_name: string;
    total: number;
    count: number;
    percentage: number;
  }[];
}

export const transactionService = {
  getTransactions: async (params?: {
    month?: string;
    category_id?: string;
  }): Promise<TransactionResponse[]> => {
    let query = "";
    if (params?.month || params?.category_id) {
      const parts = [];
      if (params.month) parts.push(`month=${params.month}`);
      if (params.category_id) parts.push(`category_id=${params.category_id}`);
      query = `?${parts.join("&")}`;
    }

    const endpoint = `/api/v1/transactions${query}`;

    const res = await api.get<{ data: TransactionResponse[] }>(endpoint);
    return res.data;
  },

  createTransaction: async (
    data: Partial<Transaction>
  ): Promise<TransactionResponse> => {
    const isValidUuid = /^[0-9a-f-]{36}$/i.test(data.categoryId || "");
    if (!isValidUuid) {
      throw new Error(
        `Invalid category ID: ${data.categoryId}. Please log out and back in to refresh categories.`
      );
    }
    const payload = {
      id: data.id,
      category_id: data.categoryId,
      amount: data.amount,
      description: data.note || "",
      transaction_date: data.date
        ? data.date.split("T")[0] + "T00:00:00Z"
        : new Date().toISOString().split("T")[0] + "T00:00:00Z"
    };

    const res = await api.post<{ data: TransactionResponse }>(
      "/api/v1/transactions",
      payload
    );
    return res.data;
  },

  updateTransaction: async (
    id: string,
    data: Partial<Transaction>
  ): Promise<TransactionResponse> => {
    const payload = {
      category_id: data.categoryId,
      amount: data.amount,
      description: data.note || "",
      transaction_date: data.date
        ? data.date.split("T")[0] + "T00:00:00Z"
        : new Date().toISOString().split("T")[0] + "T00:00:00Z"
    };
    const res = await api.put<{ data: TransactionResponse }>(
      `/api/v1/transactions/${id}`,
      payload
    );
    return res.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/transactions/${id}`);
  },

  getSummary: async (month?: string): Promise<SummaryResponse> => {
    const endpoint = `/api/v1/transactions/summary${month ? `?month=${month}` : ""}`;
    return api.get<SummaryResponse>(endpoint);
  }
};
