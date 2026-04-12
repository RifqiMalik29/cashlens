import { type Budget } from "@types";

import { budgetService } from "../api/budgetService";
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

    return data.map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: "IDR",
      period: item.period_type as Budget["period"],
      startDate: item.start_date,
      endDate: item.end_date
    }));
  } catch {
    return [];
  }
}
