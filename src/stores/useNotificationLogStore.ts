import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "@utils/generateId";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface NotificationLogEntry {
  id: string;
  timestamp: string;
  appName: string;
  packageName: string;
  title: string;
  text: string;
  isParsed: boolean;
}

interface NotificationLogState {
  logs: NotificationLogEntry[];
  addLog: (entry: Omit<NotificationLogEntry, "id" | "timestamp">) => void;
  removeOldLogs: () => void;
  clearAll: () => void;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const useNotificationLogStore = create<NotificationLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (entry) =>
        set((state) => ({
          logs: [
            {
              ...entry,
              id: generateId(),
              timestamp: new Date().toISOString()
            },
            ...state.logs
          ].slice(0, 500) // Safety cap
        })),
      removeOldLogs: () =>
        set((state) => {
          const now = Date.now();
          return {
            logs: state.logs.filter(
              (log) => now - new Date(log.timestamp).getTime() < SEVEN_DAYS_MS
            )
          };
        }),
      clearAll: () => set({ logs: [] })
    }),
    {
      name: "cashlens-notification-logs",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
