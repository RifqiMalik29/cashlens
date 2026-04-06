import { useSyncStatus } from "@hooks/useSyncStatus";
import { pullAll, syncAll, type SyncResult } from "@services/syncService";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useCallback, useEffect, useRef } from "react";

import {
  hasVersionChanged,
  performSyncWithRetry,
  type PullDataResult,
  SYNC_DEBOUNCE_MS,
  SYNC_PULL_INTERVAL_MS,
  type SyncVersions
} from "./cloudSyncHelpers";

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

  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pullIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSyncingRef = useRef(false);
  const hasInitialPullRef = useRef(false);
  const lastSyncedVersion = useRef<SyncVersions>({
    transactions: 0,
    budgets: 0,
    categories: 0,
    preferences: 0
  });

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
      } else {
        await setError(result?.error || "Sync failed");
      }
    } catch (error) {
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
    setError
  ]);

  const pullData = useCallback(async () => {
    if (!userId || !isAuthenticated || isSyncingRef.current) return;
    const isFirstTime = lastSyncedAt === null;
    isSyncingRef.current = true;
    if (isFirstTime) await setInitialPulling(true);
    else await setSyncing(true);
    try {
      const data = await performSyncWithRetry<PullDataResult>(() =>
        pullAll(userId)
      );
      if (data) {
        setTransactions(data.transactions);
        setBudgets(data.budgets);
        if (data.categories.length > 0) setCategories(data.categories);
        if (data.preferences) setPreferences(data.preferences);
      }
      await setSynced();
    } catch (error) {
      await setError((error as Error).message);
    } finally {
      isSyncingRef.current = false;
      if (isFirstTime) await setInitialPulling(false);
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
    setError
  ]);

  useEffect(() => {
    if (!userId || !isAuthenticated) return;
    const currentVersions: SyncVersions = {
      transactions: transactionVersion,
      budgets: budgetVersion,
      categories: categoryVersion,
      preferences: preferencesVersion
    };
    if (hasVersionChanged(currentVersions, lastSyncedVersion.current)) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(
        () => performSync(),
        SYNC_DEBOUNCE_MS
      );
    }
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
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
      !hasInitialPullRef.current &&
      !isSyncingRef.current
    ) {
      hasInitialPullRef.current = true;
      pullData();
    }
  }, [isAuthenticated, userId, lastSyncedAt, pullData]);

  // Periodic pull from cloud to sync changes from other devices
  useEffect(() => {
    if (!userId || !isAuthenticated) return;
    if (pullIntervalRef.current) clearInterval(pullIntervalRef.current);
    pullIntervalRef.current = setInterval(() => {
      if (!isSyncingRef.current) pullData();
    }, SYNC_PULL_INTERVAL_MS);
    return () => {
      if (pullIntervalRef.current) clearInterval(pullIntervalRef.current);
    };
  }, [userId, isAuthenticated, pullData]);

  return {
    isSyncing: isSyncingRef.current,
    lastSyncedAt,
    performSync,
    pullData,
    hasUnsyncedChanges: hasVersionChanged(
      {
        transactions: transactionVersion,
        budgets: budgetVersion,
        categories: categoryVersion,
        preferences: preferencesVersion
      },
      lastSyncedVersion.current
    )
  };
}
