import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

const SYNC_STORAGE_KEY = "sync-status";

interface SyncStatus {
  isSyncing: boolean;
  isInitialPull: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

const defaultSyncStatus: SyncStatus = {
  isSyncing: false,
  isInitialPull: false,
  lastSyncedAt: null,
  error: null
};

export function useSyncStatus() {
  const { userId } = useAuthStore();
  const [status, setStatus] = useState<SyncStatus>(defaultSyncStatus);

  const loadSyncStatus = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SYNC_STORAGE_KEY);
      if (stored) {
        setStatus(JSON.parse(stored));
      }
    } catch {
      // Ignore errors, use default status
    }
  }, []);

  const updateSyncStatus = useCallback(
    async (updates: Partial<SyncStatus>) => {
      const newStatus = { ...status, ...updates };
      setStatus(newStatus);
      try {
        await AsyncStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(newStatus));
      } catch {
        // Ignore storage errors
      }
    },
    [status]
  );

  const setSyncing = useCallback(
    async (isSyncing: boolean) => {
      await updateSyncStatus({ isSyncing, error: null });
    },
    [updateSyncStatus]
  );

  const setInitialPulling = useCallback(
    async (isInitialPull: boolean) => {
      await updateSyncStatus({ isInitialPull, error: null });
    },
    [updateSyncStatus]
  );

  const setSynced = useCallback(async () => {
    await updateSyncStatus({
      isSyncing: false,
      isInitialPull: false,
      lastSyncedAt: new Date().toISOString(),
      error: null
    });
  }, [updateSyncStatus]);

  const setError = useCallback(
    async (error: string) => {
      await updateSyncStatus({ isSyncing: false, isInitialPull: false, error });
    },
    [updateSyncStatus]
  );

  useEffect(() => {
    loadSyncStatus();
  }, [loadSyncStatus]);

  useEffect(() => {
    if (!userId) {
      setStatus(defaultSyncStatus);
      AsyncStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(defaultSyncStatus));
    }
  }, [userId]);

  const getRelativeTime = useCallback((dateString: string | null): string => {
    if (!dateString) return "Belum pernah";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins}m yang lalu`;
    if (diffHours < 24) return `${diffHours}j yang lalu`;
    if (diffDays < 7) return `${diffDays}h yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short"
    });
  }, []);

  return {
    ...status,
    setSyncing,
    setInitialPulling,
    setSynced,
    setError,
    loadSyncStatus,
    getRelativeTime
  };
}
