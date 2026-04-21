import { type Budget } from "@types";

import { type BudgetResponse, budgetService } from "../budgetService";
import { isValidUserId, type SyncResult } from "./syncUtils";

export async function pushBudgets(
  _userId: string,
  _budgets: Budget[]
): Promise<SyncResult> {
  return { success: true, syncedAt: new Date().toISOString() };
}

export async function pullBudgets(userId: string): Promise<Budget[]> {
  if (!isValidUserId(userId)) return [];

  try {
    const data = await budgetService.getBudgets();

    return data.map((item: BudgetResponse) => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: "IDR",
      period: item.period as Budget["period"],
      startDate: item.start_date,
      endDate: item.end_date
    }));
  } catch {
    return [];
  }
}
