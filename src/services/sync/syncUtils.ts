import { type Budget, type Category, type Transaction } from "@types";

export const LOG_PREFIX = "[SyncService]";

// Database row types (snake_case from Supabase)
export interface TransactionRow {
  id: string;
  amount: number;
  currency: string;
  amount_in_base_currency: number;
  exchange_rate: number;
  type: string;
  category_id: string;
  note: string;
  date: string;
  receipt_image_uri: string | null;
  is_from_scan: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface BudgetRow {
  id: string;
  category_id: string;
  amount: number;
  currency: string;
  period: string;
  start_date: string;
  end_date: string;
  user_id: string;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  is_custom: boolean;
  type: string;
  user_id: string;
  created_at: string;
}

export function isTableNotFoundError(error: unknown): boolean {
  const message = (error as Error).message.toLowerCase();
  return message.includes("relation") || message.includes("does not exist");
}

export function isValidUserId(userId: string): boolean {
  if (!userId || userId.trim() === "" || userId.includes("bypass")) {
    return false;
  }
  return userId.length > 5;
}

// Mapper functions: camelCase → snake_case for Supabase
export function mapTransactionToDb(t: Transaction) {
  return {
    id: t.id,
    amount: t.amount,
    currency: t.currency,
    amount_in_base_currency: t.amountInBaseCurrency,
    exchange_rate: t.exchangeRate,
    type: t.type,
    category_id: t.categoryId,
    note: t.note,
    date: t.date,
    receipt_image_uri: t.receiptImageUri,
    is_from_scan: t.isFromScan,
    created_at: t.createdAt,
    updated_at: t.updatedAt
  };
}

export function mapBudgetToDb(b: Budget) {
  return {
    id: b.id,
    category_id: b.categoryId,
    amount: b.amount,
    currency: b.currency,
    period: b.period,
    start_date: b.startDate,
    end_date: b.endDate
  };
}

export function mapCategoryToDb(c: Category) {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: c.color,
    is_default: c.isDefault,
    is_custom: c.isCustom,
    type: c.type
  };
}

export interface SyncResult {
  success: boolean;
  error?: string;
  syncedAt?: string;
}
