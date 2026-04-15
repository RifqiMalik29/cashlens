import { type Budget } from "@types";

import { api } from "./apiClient";

export interface BudgetResponse {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  alert_threshold?: number;
  spent_amount?: number;
  percentage_used?: number;
  created_at: string;
  updated_at: string;
}

export const budgetService = {
  getBudgets: async (): Promise<BudgetResponse[]> => {
    return await api.get<BudgetResponse[]>("/api/v1/budgets");
  },

  createBudget: async (data: Partial<Budget>): Promise<BudgetResponse> => {
    return await api.post<BudgetResponse>("/api/v1/budgets", {
      category_id: data.categoryId,
      amount: data.amount,
      period: data.period,
      start_date: data.startDate,
      end_date: data.endDate
    });
  },

  updateBudget: async (
    id: string,
    data: Partial<Budget>
  ): Promise<BudgetResponse> => {
    return await api.put<BudgetResponse>(`/api/v1/budgets/${id}`, {
      category_id: data.categoryId,
      amount: data.amount,
      period: data.period,
      start_date: data.startDate,
      end_date: data.endDate
    });
  },

  deleteBudget: async (id: string): Promise<void> => {
    return api.delete(`/api/v1/budgets/${id}`);
  }
};
