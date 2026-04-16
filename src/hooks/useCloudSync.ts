import { useSyncStatus } from "@hooks/useSyncStatus";
import { pullAll } from "@services/syncService";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import {
  performSyncWithRetry,
  type PullDataResult,
  SYNC_PULL_INTERVAL_MS
} from "./cloudSyncHelpers";

export function useCloudSync() {
  const { userId, isAuthenticated, setPreferences } = useAuthStore();
  const { setSyncing, setSynced, setError, setInitialPulling, lastSyncedAt } =
    useSyncStatus();

  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const setBudgets = useBudgetStore((state) => state.setBudgets);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  const isSyncingRef = useRef(false);
  const hasInitialPullRef = useRef(false);
  const pullIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable refs so interval/callbacks don't need to re-create when these change
  const setTransactionsRef = useRef(setTransactions);
  const setBudgetsRef = useRef(setBudgets);
  const setCategoriesRef = useRef(setCategories);
  const setPreferencesRef = useRef(setPreferences);
  const fetchSubscriptionRef = useRef(fetchSubscription);
  const setSyncingRef = useRef(setSyncing);
  const setSyncedRef = useRef(setSynced);
  const setErrorRef = useRef(setError);
  const setInitialPullingRef = useRef(setInitialPulling);
  const lastSyncedAtRef = useRef(lastSyncedAt);
  const userIdRef = useRef(userId);
  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    setTransactionsRef.current = setTransactions;
  }, [setTransactions]);
  useEffect(() => {
    setBudgetsRef.current = setBudgets;
  }, [setBudgets]);
  useEffect(() => {
    setCategoriesRef.current = setCategories;
  }, [setCategories]);
  useEffect(() => {
    setPreferencesRef.current = setPreferences;
  }, [setPreferences]);
  useEffect(() => {
    fetchSubscriptionRef.current = fetchSubscription;
  }, [fetchSubscription]);
  useEffect(() => {
    setSyncingRef.current = setSyncing;
  }, [setSyncing]);
  useEffect(() => {
    setSyncedRef.current = setSynced;
  }, [setSynced]);
  useEffect(() => {
    setErrorRef.current = setError;
  }, [setError]);
  useEffect(() => {
    setInitialPullingRef.current = setInitialPulling;
  }, [setInitialPulling]);
  useEffect(() => {
    lastSyncedAtRef.current = lastSyncedAt;
  }, [lastSyncedAt]);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const pullData = useCallback(async () => {
    const currentUserId = userIdRef.current;
    const currentIsAuthenticated = isAuthenticatedRef.current;
    if (!currentUserId || !currentIsAuthenticated || isSyncingRef.current)
      return;

    const isFirstTime = lastSyncedAtRef.current === null;
    isSyncingRef.current = true;

    if (isFirstTime) await setInitialPullingRef.current(true);
    else await setSyncingRef.current(true);

    try {
      // Fetch main data and subscription data in parallel
      const [data] = await Promise.all([
        performSyncWithRetry<PullDataResult>(() => pullAll(currentUserId)),
        fetchSubscriptionRef.current()
      ]);

      if (data) {
        setTransactionsRef.current(data.transactions);
        setBudgetsRef.current(data.budgets);
        if (data.categories.length > 0)
          setCategoriesRef.current(data.categories);
        if (data.preferences) setPreferencesRef.current(data.preferences);
      }
      await setSyncedRef.current();
    } catch (error) {
      await setErrorRef.current((error as Error).message);
    } finally {
      isSyncingRef.current = false;
      if (isFirstTime) await setInitialPullingRef.current(false);
    }
  }, []); // stable — uses refs internally

  // Reset on logout
  useEffect(() => {
    if (!userId) {
      hasInitialPullRef.current = false;
    }
  }, [userId]);

  // Initial pull on login (once)
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

  // Periodic pull — stable interval, does not restart on lastSyncedAt change
  // Pauses when app is backgrounded to save battery
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      if (pullIntervalRef.current) {
        clearInterval(pullIntervalRef.current);
        pullIntervalRef.current = null;
      }
      return;
    }

    if (pullIntervalRef.current) return; // already running

    // Only run sync when app is active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // Resume syncing when app becomes active
        if (!pullIntervalRef.current) {
          pullIntervalRef.current = setInterval(() => {
            if (!isSyncingRef.current) pullData();
          }, SYNC_PULL_INTERVAL_MS);
        }
      } else {
        // Pause syncing when app is backgrounded or inactive
        if (pullIntervalRef.current) {
          clearInterval(pullIntervalRef.current);
          pullIntervalRef.current = null;
        }
      }
    };

    // Start with active interval
    pullIntervalRef.current = setInterval(() => {
      if (!isSyncingRef.current) pullData();
    }, SYNC_PULL_INTERVAL_MS);

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      if (pullIntervalRef.current) {
        clearInterval(pullIntervalRef.current);
        pullIntervalRef.current = null;
      }
    };
  }, [userId, isAuthenticated, pullData]);

  return { pullData };
}
