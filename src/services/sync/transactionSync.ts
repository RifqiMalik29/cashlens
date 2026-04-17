import { type Transaction } from "@types";

import { transactionService } from "../api/transactionService";
import { isValidUserId, type SyncResult } from "./syncUtils";

export async function pushTransactions(
  _userId: string,
  _transactions: Transaction[]
): Promise<SyncResult> {
  // Write-through: transactions are written to the API at creation time in handlers.ts
  // This function intentionally does nothing to prevent duplicate creation
  return { success: true, syncedAt: new Date().toISOString() };
}

export async function pullTransactions(userId: string): Promise<Transaction[]> {
  if (!isValidUserId(userId)) return [];

  try {
    const data = await transactionService.getTransactions();

    return data.map((item) => ({
      id: item.id,
      amount: item.amount,
      currency: "IDR",
      amountInBaseCurrency: item.amount,
      exchangeRate: 1,
      type: (item.category?.type ?? "expense") as Transaction["type"],
      categoryId: item.category_id || "",
      note: item.description,
      date: item.date ?? item.transaction_date,
      receiptImageUri: undefined,
      isFromScan: false,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch {
    return [];
  }
}
