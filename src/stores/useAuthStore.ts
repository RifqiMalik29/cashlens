import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type UserPreferences } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
  preferences: UserPreferences;
  setAuthenticated: (value: boolean) => void;
  setOnboarded: (value: boolean) => void;
  setUserId: (id: string | null) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  baseCurrency: "IDR",
  theme: "system",
  language: "id",
  createdAt: new Date().toISOString()
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isOnboarded: false,
      userId: null,
      preferences: defaultPreferences,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setUserId: (id) => set({ userId: id }),
      updatePreferences: (data) =>
        set((state) => ({ preferences: { ...state.preferences, ...data } })),
      reset: () => set({ isAuthenticated: false, userId: null })
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
