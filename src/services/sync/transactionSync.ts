import { type Transaction } from "@types";

import { supabase } from "../supabase";
import {
  isTableNotFoundError,
  isValidUserId,
  mapTransactionToDb,
  type SyncResult,
  type TransactionRow
} from "./syncUtils";

export async function pushTransactions(
  userId: string,
  transactions: Transaction[]
): Promise<SyncResult> {
  if (!isValidUserId(userId)) {
    return { success: false, error: "Invalid user ID" };
  }

  try {
    const { error } = await supabase.from("transactions").upsert(
      transactions.map((t) => ({
        ...mapTransactionToDb(t),
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

export async function pullTransactions(userId: string): Promise<Transaction[]> {
  if (!isValidUserId(userId)) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        return [];
      }
      throw error;
    }

    const transactions: Transaction[] = (data || []).map(
      (item: TransactionRow) => ({
        id: item.id,
        amount: item.amount,
        currency: item.currency,
        amountInBaseCurrency: item.amount_in_base_currency,
        exchangeRate: item.exchange_rate,
        type: item.type as Transaction["type"],
        categoryId: item.category_id,
        note: item.note,
        date: item.date,
        receiptImageUri: item.receipt_image_uri || undefined,
        isFromScan: item.is_from_scan,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })
    );

    return transactions;
  } catch {
    return [];
  }
}
