/* eslint-disable no-console */
/* eslint-disable max-lines */
import { useCallback, useEffect, useRef } from "react";

import { useSyncStatus } from "@/hooks/useSyncStatus";
import { pullAll, syncAll, type SyncResult } from "@/services/syncService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import {
  type Budget,
  type Category,
  type Transaction,
  type UserPreferences
} from "@/types";

const SYNC_DEBOUNCE_MS = 2000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

interface PullDataResult {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  preferences: UserPreferences | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCloudSync() {
  const { userId, isAuthenticated, preferences, setPreferences } =
    useAuthStore();
  const { setSyncing, setSynced, setError, setInitialPulling, lastSyncedAt } =
    useSyncStatus();

  const transactions = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const transactionVersion = useTransactionStore((state) => state._syncVersion);

  const budgets = useBudgetStore((state) => state.budgets);
  const setBudgets = useBudgetStore((state) => state.setBudgets);
  const budgetVersion = useBudgetStore((state) => state._syncVersion);

  const categories = useCategoryStore((state) => state.categories);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const categoryVersion = useCategoryStore((state) => state._syncVersion);
  const preferencesVersion = useAuthStore((state) => state._syncVersion);

  const syncTimeoutRef = useRef<number | null>(null);
  const isSyncingRef = useRef(false);
  const hasInitialPullRef = useRef(false);
  const lastSyncedVersion = useRef({
    transactions: 0,
    budgets: 0,
    categories: 0,
    preferences: 0
  });

  const performSyncWithRetry = useCallback(
    async <T>(
      syncFn: () => Promise<T>,
      retries = MAX_RETRIES
    ): Promise<T | undefined> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await syncFn();
        } catch (error) {
          const isNetworkError =
            (error as Error).message.includes("Network request failed") ||
            (error as Error).message.includes("fetch");

          if (isNetworkError && attempt < retries - 1) {
            const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
            console.log(
              `[CloudSync] ⚠ Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`
            );
            await sleep(delay);
          } else {
            throw error;
          }
        }
      }
      return undefined;
    },
    []
  );

  const performSync = useCallback(async () => {
    if (!userId || !isAuthenticated || isSyncingRef.current) return;

    isSyncingRef.current = true;
    await setSyncing(true);

    try {
      const result = await performSyncWithRetry<SyncResult>(() =>
        syncAll(userId, transactions, budgets, categories, preferences)
      );

      if (result?.success) {
        await setSynced();
        lastSyncedVersion.current = {
          transactions: transactionVersion,
          budgets: budgetVersion,
          categories: categoryVersion,
          preferences: preferencesVersion
        };
        console.log("[CloudSync] ✓ Sync completed successfully");
      } else {
        await setError(result?.error || "Sync failed");
      }
    } catch (error) {
      console.error("[CloudSync] ✗ Sync failed:", (error as Error).message);
      await setError((error as Error).message);
    } finally {
      isSyncingRef.current = false;
    }
  }, [
    userId,
    isAuthenticated,
    transactions,
    budgets,
    categories,
    preferences,
    transactionVersion,
    budgetVersion,
    categoryVersion,
    preferencesVersion,
    setSyncing,
    setSynced,
    setError,
    performSyncWithRetry
  ]);

  const pullData = useCallback(async () => {
    if (!userId || !isAuthenticated || isSyncingRef.current) return;

    const isFirstTime = lastSyncedAt === null;

    isSyncingRef.current = true;
    if (isFirstTime) {
      await setInitialPulling(true);
    } else {
      await setSyncing(true);
    }

    try {
      const data = await performSyncWithRetry<PullDataResult>(() =>
        pullAll(userId)
      );

      if (data) {
        // Always update transactions and budgets even if empty
        setTransactions(data.transactions);
        setBudgets(data.budgets);

        // For categories, only update if we pulled something from cloud
        // otherwise we might lose local defaults on first pull
        if (data.categories.length > 0) {
          setCategories(data.categories);
        }

        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }

      await setSynced();
      console.log("[CloudSync] ✓ Pull completed successfully");
    } catch (error) {
      console.error("[CloudSync] ✗ Pull failed:", (error as Error).message);
      await setError((error as Error).message);
    } finally {
      isSyncingRef.current = false;
      if (isFirstTime) {
        await setInitialPulling(false);
      }
    }
  }, [
    userId,
    isAuthenticated,
    lastSyncedAt,
    setInitialPulling,
    setSyncing,
    setTransactions,
    setBudgets,
    setCategories,
    setPreferences,
    setSynced,
    setError,
    performSyncWithRetry
  ]);

  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    if (
      transactionVersion !== lastSyncedVersion.current.transactions ||
      budgetVersion !== lastSyncedVersion.current.budgets ||
      categoryVersion !== lastSyncedVersion.current.categories ||
      preferencesVersion !== lastSyncedVersion.current.preferences
    ) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSync();
      }, SYNC_DEBOUNCE_MS);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [
    userId,
    isAuthenticated,
    transactionVersion,
    budgetVersion,
    categoryVersion,
    preferencesVersion,
    performSync
  ]);

  useEffect(() => {
    if (!userId) {
      hasInitialPullRef.current = false;
      lastSyncedVersion.current = {
        transactions: 0,
        budgets: 0,
        categories: 0,
        preferences: 0
      };
    }
  }, [userId]);

  useEffect(() => {
    if (
      isAuthenticated &&
      userId &&
      lastSyncedAt === null &&
      !hasInitialPullRef.current
    ) {
      hasInitialPullRef.current = true;
      pullData();
    }
  }, [isAuthenticated, userId, lastSyncedAt, pullData]);

  return {
    isSyncing: isSyncingRef.current,
    lastSyncedAt,
    performSync,
    pullData,
    hasUnsyncedChanges:
      transactionVersion !== lastSyncedVersion.current.transactions ||
      budgetVersion !== lastSyncedVersion.current.budgets ||
      categoryVersion !== lastSyncedVersion.current.categories ||
      preferencesVersion !== lastSyncedVersion.current.preferences
  };
}
