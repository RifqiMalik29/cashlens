import AsyncStorage from "@react-native-async-storage/async-storage";
import { type UserPreferences } from "@types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
  userEmail: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  subscriptionTier: "free" | "premium";
  stealthScansUsed: number;
  preferences: UserPreferences;
  _syncVersion: number;
  setAuthenticated: (value: boolean) => void;
  setOnboarded: (value: boolean) => void;
  setUserId: (id: string | null, email?: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setSubscriptionTier: (tier: "free" | "premium") => void;
  incrementStealthScans: () => void;
  resetStealthScans: () => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  setPreferences: (preferences: UserPreferences) => void;
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
      userEmail: null,
      accessToken: null,
      refreshToken: null,
      subscriptionTier: "free",
      stealthScansUsed: 0,
      preferences: defaultPreferences,
      _syncVersion: 0,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setUserId: (id, email) => set({ userId: id, userEmail: email ?? null }),
      setUserEmail: (email) => set({ userEmail: email }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
      incrementStealthScans: () =>
        set((state) => ({ stealthScansUsed: state.stealthScansUsed + 1 })),
      resetStealthScans: () => set({ stealthScansUsed: 0 }),
      updatePreferences: (data) =>
        set((state) => ({
          preferences: { ...state.preferences, ...data },
          _syncVersion: state._syncVersion + 1
        })),
      setPreferences: (preferences) => set({ preferences, _syncVersion: 0 }),
      reset: () =>
        set({
          isAuthenticated: false,
          userId: null,
          userEmail: null,
          accessToken: null,
          refreshToken: null,
          subscriptionTier: "free",
          stealthScansUsed: 0,
          preferences: defaultPreferences,
          _syncVersion: 0
        })
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
