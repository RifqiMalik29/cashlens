import {
  type Budget,
  type Category,
  type Transaction,
  type UserPreferences
} from "@types";

export const SYNC_DEBOUNCE_MS = 2000;
export const SYNC_PULL_INTERVAL_MS = 5 * 60 * 1000; // Pull from cloud every 5 minutes
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY_MS = 1000;

export interface PullDataResult {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  preferences: Partial<UserPreferences> | null;
}

export interface SyncVersions {
  transactions: number;
  budgets: number;
  categories: number;
  preferences: number;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function performSyncWithRetry<T>(
  syncFn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T | undefined> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await syncFn();
    } catch (error) {
      const isNetworkError =
        (error as Error).message.includes("Network request failed") ||
        (error as Error).message.includes("fetch");

      if (isNetworkError && attempt < retries - 1) {
        const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
  return undefined;
}

export function hasVersionChanged(
  current: SyncVersions,
  last: SyncVersions
): boolean {
  return (
    current.transactions !== last.transactions ||
    current.budgets !== last.budgets ||
    current.categories !== last.categories ||
    current.preferences !== last.preferences
  );
}
