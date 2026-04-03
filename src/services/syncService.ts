/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import { type Budget, type Category, type Transaction } from "@/types";

import { supabase } from "./supabase";

const LOG_PREFIX = "[SyncService]";

function isTableNotFoundError(error: any): boolean {
  const message = (error as Error).message.toLowerCase();
  return message.includes("relation") || message.includes("does not exist");
}

function isValidUserId(userId: string): boolean {
  // Check if it's a valid UUID format or at least not a placeholder
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return (
    uuidRegex.test(userId) || (!userId.includes("bypass") && userId.length > 10)
  );
}

export interface SyncResult {
  success: boolean;
  error?: string;
  syncedAt?: string;
}

export async function pushTransactions(
  userId: string,
  transactions: Transaction[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping sync: invalid user ID`);
    return { success: false, error: "Invalid user ID" };
  }

  console.log(`${LOG_PREFIX} Pushing ${transactions.length} transactions...`);

  try {
    const { error } = await supabase.from("transactions").upsert(
      transactions.map((t) => ({
        ...t,
        user_id: userId
      })),
      {
        onConflict: "id"
      }
    );

    if (error) throw error;

    console.log(`${LOG_PREFIX} ✓ Transactions pushed successfully`);
    return {
      success: true,
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to push transactions:`,
      (error as Error).message
    );
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullTransactions(userId: string): Promise<Transaction[]> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping pull: invalid user ID`);
    return [];
  }

  console.log(`${LOG_PREFIX} Pulling transactions...`);

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log(
          `${LOG_PREFIX} ⚠ Table not created yet. Run supabase-schema.sql in Supabase SQL Editor.`
        );
        return [];
      }
      throw error;
    }

    const transactions: Transaction[] = (data || []).map((item: any) => ({
      id: item.id,
      amount: item.amount,
      currency: item.currency,
      amountInBaseCurrency: item.amount_in_base_currency,
      exchangeRate: item.exchange_rate,
      type: item.type,
      categoryId: item.category_id,
      note: item.note,
      date: item.date,
      receiptImageUri: item.receipt_image_uri,
      isFromScan: item.is_from_scan,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    console.log(`${LOG_PREFIX} ✓ Pulled ${transactions.length} transactions`);
    return transactions;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to pull transactions:`,
      (error as Error).message
    );
    return [];
  }
}

export async function pushBudgets(
  userId: string,
  budgets: Budget[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping sync: invalid user ID`);
    return { success: false, error: "Invalid user ID" };
  }

  console.log(`${LOG_PREFIX} Pushing ${budgets.length} budgets...`);

  try {
    const { error } = await supabase.from("budgets").upsert(
      budgets.map((b) => ({
        ...b,
        user_id: userId
      })),
      {
        onConflict: "id"
      }
    );

    if (error) throw error;

    console.log(`${LOG_PREFIX} ✓ Budgets pushed successfully`);
    return {
      success: true,
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to push budgets:`,
      (error as Error).message
    );
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullBudgets(userId: string): Promise<Budget[]> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping pull: invalid user ID`);
    return [];
  }

  console.log(`${LOG_PREFIX} Pulling budgets...`);

  try {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log(
          `${LOG_PREFIX} ⚠ Table not created yet. Run supabase-schema.sql in Supabase SQL Editor.`
        );
        return [];
      }
      throw error;
    }

    const budgets: Budget[] = (data || []).map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: item.currency,
      period: item.period,
      startDate: item.start_date,
      endDate: item.end_date
    }));

    console.log(`${LOG_PREFIX} ✓ Pulled ${budgets.length} budgets`);
    return budgets;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to pull budgets:`,
      (error as Error).message
    );
    return [];
  }
}

export async function pushCategories(
  userId: string,
  categories: Category[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping sync: invalid user ID`);
    return { success: false, error: "Invalid user ID" };
  }

  console.log(`${LOG_PREFIX} Pushing ${categories.length} categories...`);

  try {
    const { error } = await supabase.from("categories").upsert(
      categories.map((c) => ({
        ...c,
        user_id: userId
      })),
      {
        onConflict: "id"
      }
    );

    if (error) throw error;

    console.log(`${LOG_PREFIX} ✓ Categories pushed successfully`);
    return {
      success: true,
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to push categories:`,
      (error as Error).message
    );
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function pullCategories(userId: string): Promise<Category[]> {
  if (!isValidUserId(userId)) {
    console.log(`${LOG_PREFIX} ⚠ Skipping pull: invalid user ID`);
    return [];
  }

  console.log(`${LOG_PREFIX} Pulling categories...`);

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log(
          `${LOG_PREFIX} ⚠ Table not created yet. Run supabase-schema.sql in Supabase SQL Editor.`
        );
        return [];
      }
      throw error;
    }

    const categories: Category[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      color: item.color,
      isDefault: item.is_default,
      isCustom: item.is_custom,
      type: item.type
    }));

    console.log(`${LOG_PREFIX} ✓ Pulled ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Failed to pull categories:`,
      (error as Error).message
    );
    return [];
  }
}

export async function syncAll(
  userId: string,
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[]
): Promise<SyncResult> {
  console.log(`${LOG_PREFIX} Starting full sync...`);

  try {
    const [txResult, budgetResult, categoryResult] = await Promise.all([
      pushTransactions(userId, transactions),
      pushBudgets(userId, budgets),
      pushCategories(userId, categories)
    ]);

    const success =
      txResult.success && budgetResult.success && categoryResult.success;

    if (success) {
      console.log(`${LOG_PREFIX} ✓ Full sync completed`);
      return {
        success: true,
        syncedAt: new Date().toISOString()
      };
    } else {
      const errors = [txResult.error, budgetResult.error, categoryResult.error]
        .filter(Boolean)
        .join(", ");
      return {
        success: false,
        error: errors || "Unknown sync error"
      };
    }
  } catch (error) {
    console.error(
      `${LOG_PREFIX} ✗ Full sync failed:`,
      (error as Error).message
    );
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
}> {
  console.log(`${LOG_PREFIX} Pulling all data...`);

  const [transactions, budgets, categories] = await Promise.all([
    pullTransactions(userId),
    pullBudgets(userId),
    pullCategories(userId)
  ]);

  console.log(`${LOG_PREFIX} ✓ Full pull completed`);
  return { transactions, budgets, categories };
}
