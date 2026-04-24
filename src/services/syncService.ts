import {
  type Budget,
  type Category,
  type Transaction,
  type UserPreferences
} from "@types";

import { pullBudgets, pushBudgets } from "./sync/budgetSync";
import { pullCategories, pushCategories } from "./sync/categorySync";
import { pullProfile, pushProfile } from "./sync/profileSync";
import { type SyncResult } from "./sync/syncUtils";
import { pullTransactions, pushTransactions } from "./sync/transactionSync";

// Re-export individual sync functions for backward compatibility
export { pullBudgets, pushBudgets } from "./sync/budgetSync";
export { pullCategories, pushCategories } from "./sync/categorySync";
export { pullProfile, pushProfile } from "./sync/profileSync";
export type { SyncResult } from "./sync/syncUtils";
export { pullTransactions, pushTransactions } from "./sync/transactionSync";

export async function syncAll(
  userId: string,
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  preferences?: Partial<UserPreferences>
): Promise<SyncResult> {
  try {
    const syncPromises = [
      pushTransactions(userId, transactions),
      pushBudgets(userId, budgets),
      pushCategories(userId, categories)
    ];

    if (preferences) {
      syncPromises.push(pushProfile(userId, preferences));
    }

    const results = await Promise.all(syncPromises);
    const success = results.every((r) => r.success);

    if (success) {
      return {
        success: true,
        syncedAt: new Date().toISOString()
      };
    } else {
      const errors = results
        .map((r) => r.error)
        .filter(Boolean)
        .join(", ");
      return {
        success: false,
        error: errors || "Unknown sync error"
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullAll(userId: string): Promise<{
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  preferences: Partial<UserPreferences> | null;
}> {
  const [transactions, budgets, categories, preferences] = await Promise.all([
    pullTransactions(userId),
    pullBudgets(userId),
    pullCategories(userId),
    pullProfile(userId)
  ]);

  return { transactions, budgets, categories, preferences };
}
