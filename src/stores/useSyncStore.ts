import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SYNC_STORAGE_KEY = "sync-status-storage";

interface SyncStatus {
  isSyncing: boolean;
  isInitialPull: boolean;
  isLogoutSyncing: boolean;
  isManualSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

interface SyncState extends SyncStatus {
  setSyncing: (isSyncing: boolean) => void;
  setInitialPulling: (isInitialPull: boolean) => void;
  setLogoutSyncing: (isLogoutSyncing: boolean) => void;
  setManualSyncing: (isManualSyncing: boolean) => void;
  setSynced: () => void;
  setError: (error: string) => void;
  reset: () => void;
}

const defaultSyncStatus: SyncStatus = {
  isSyncing: false,
  isInitialPull: false,
  isLogoutSyncing: false,
  isManualSyncing: false,
  lastSyncedAt: null,
  error: null
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      ...defaultSyncStatus,
      setSyncing: (isSyncing) => set({ isSyncing, error: null }),
      setInitialPulling: (isInitialPull) => set({ isInitialPull, error: null }),
      setLogoutSyncing: (isLogoutSyncing) =>
        set({ isLogoutSyncing, error: null }),
      setManualSyncing: (isManualSyncing) =>
        set({ isManualSyncing, error: null }),
      setSynced: () =>
        set({
          isSyncing: false,
          isInitialPull: false,
          isLogoutSyncing: false,
          isManualSyncing: false,
          lastSyncedAt: new Date().toISOString(),
          error: null
        }),
      setError: (error) =>
        set({
          isSyncing: false,
          isInitialPull: false,
          isLogoutSyncing: false,
          isManualSyncing: false,
          error
        }),
      reset: () => set(defaultSyncStatus)
    }),
    {
      name: SYNC_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist lastSyncedAt and error. Transient states should not be persisted.
      partialize: (state) => ({
        lastSyncedAt: state.lastSyncedAt,
        error: state.error
      })
    }
  )
);
