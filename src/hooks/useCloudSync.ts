/* eslint-disable no-console */
import { useCallback, useEffect, useRef } from "react";

import { useSyncStatus } from "@/hooks/useSyncStatus";
import { pullAll, syncAll } from "@/services/syncService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";

const SYNC_DEBOUNCE_MS = 2000;

export function useCloudSync() {
  const { userId, isAuthenticated } = useAuthStore();
  const { setSyncing, setSynced, setError, lastSyncedAt } = useSyncStatus();

  const transactions = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const transactionVersion = useTransactionStore((state) => state._syncVersion);

  const budgets = useBudgetStore((state) => state.budgets);
  const setBudgets = useBudgetStore((state) => state.setBudgets);
  const budgetVersion = useBudgetStore((state) => state._syncVersion);

  const categories = useCategoryStore((state) => state.categories);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const categoryVersion = useCategoryStore((state) => state._syncVersion);

  const syncTimeoutRef = useRef<number | null>(null);
  const lastSyncedVersion = useRef({
    transactions: 0,
    budgets: 0,
    categories: 0
  });

  const performSync = useCallback(async () => {
    if (!userId || !isAuthenticated) return;

    await setSyncing(true);

    try {
      const result = await syncAll(userId, transactions, budgets, categories);

      if (result.success) {
        await setSynced();
        lastSyncedVersion.current = {
          transactions: transactionVersion,
          budgets: budgetVersion,
          categories: categoryVersion
        };
        console.log("[CloudSync] ✓ Sync completed successfully");
      } else {
        await setError(result.error || "Sync failed");
      }
    } catch (error) {
      await setError((error as Error).message);
    }
  }, [
    userId,
    isAuthenticated,
    transactions,
    budgets,
    categories,
    transactionVersion,
    budgetVersion,
    categoryVersion,
    setSyncing,
    setSynced,
    setError
  ]);

  const pullData = useCallback(async () => {
    if (!userId || !isAuthenticated) return;

    await setSyncing(true);

    try {
      const data = await pullAll(userId);

      if (data.transactions.length > 0) {
        setTransactions(data.transactions);
      }
      if (data.budgets.length > 0) {
        setBudgets(data.budgets);
      }
      if (data.categories.length > 0) {
        setCategories(data.categories);
      }

      await setSynced();
      console.log("[CloudSync] ✓ Pull completed successfully");
    } catch (error) {
      await setError((error as Error).message);
    }
  }, [
    userId,
    isAuthenticated,
    setTransactions,
    setBudgets,
    setCategories,
    setSyncing,
    setSynced,
    setError
  ]);

  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    if (
      transactionVersion !== lastSyncedVersion.current.transactions ||
      budgetVersion !== lastSyncedVersion.current.budgets ||
      categoryVersion !== lastSyncedVersion.current.categories
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
    performSync
  ]);

  useEffect(() => {
    if (isAuthenticated && userId && lastSyncedAt === null) {
      pullData();
    }
  }, [isAuthenticated, userId, lastSyncedAt, pullData]);

  return {
    isSyncing: false,
    lastSyncedAt,
    performSync,
    pullData
  };
}
