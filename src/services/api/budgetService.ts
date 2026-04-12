import { type Budget } from "@types";

import { api } from "./apiClient";

export interface BudgetResponse {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period_type: "weekly" | "monthly" | "yearly";
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
    const res = await api.get<{ data: BudgetResponse[] }>("/api/v1/budgets");
    return res.data;
  },

  createBudget: async (data: Partial<Budget>): Promise<BudgetResponse> => {
    const res = await api.post<{ data: BudgetResponse }>("/api/v1/budgets", {
      category_id: data.categoryId,
      amount: data.amount,
      period_type: data.period,
      start_date: data.startDate,
      end_date: data.endDate
    });
    return res.data;
  },

  updateBudget: async (
    id: string,
    data: Partial<Budget>
  ): Promise<BudgetResponse> => {
    const res = await api.put<{ data: BudgetResponse }>(
      `/api/v1/budgets/${id}`,
      {
        category_id: data.categoryId,
        amount: data.amount,
        period_type: data.period,
        start_date: data.startDate,
        end_date: data.endDate
      }
    );
    return res.data;
  },

  deleteBudget: async (id: string): Promise<void> => {
    return api.delete(`/api/v1/budgets/${id}`);
  }
};
