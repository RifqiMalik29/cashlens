import { type Budget } from "@types";

import { supabase } from "../supabase";
import {
  type BudgetRow,
  isTableNotFoundError,
  isValidUserId,
  mapBudgetToDb,
  type SyncResult
} from "./syncUtils";

export async function pushBudgets(
  userId: string,
  budgets: Budget[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    return { success: false, error: "Invalid user ID" };
  }

  try {
    const { error } = await supabase.from("budgets").upsert(
      budgets.map((b) => ({
        ...mapBudgetToDb(b),
        user_id: userId
      })),
      {
        onConflict: "id"
      }
    );

    if (error) throw error;

    return {
      success: true,
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullBudgets(userId: string): Promise<Budget[]> {
  if (!isValidUserId(userId)) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        return [];
      }
      throw error;
    }

    const budgets: Budget[] = (data || []).map((item: BudgetRow) => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: item.currency,
      period: item.period as Budget["period"],
      startDate: item.start_date,
      endDate: item.end_date
    }));

    return budgets;
  } catch {
    return [];
  }
}
