import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteAuthTokens,
  deleteUserData,
  getAuthTokens,
  getUserData,
  saveAuthTokens,
  saveUserData
} from "@services/secureStorage";
import { revenueCatService } from "@services/subscriptionService";
import type { UserPreferences } from "@types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
  userEmail: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  stealthScansUsed: number;
  preferences: UserPreferences;
  _syncVersion: number;
  setAuthenticated: (value: boolean) => void;
  setOnboarded: (value: boolean) => void;
  setUserId: (id: string | null, email?: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  incrementStealthScans: () => void;
  resetStealthScans: () => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  setPreferences: (preferences: UserPreferences) => void;
  reset: () => Promise<void>;
  initializeFromSecureStorage: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  baseCurrency: "IDR",
  theme: "light",
  language: "id",
  createdAt: new Date().toISOString()
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isOnboarded: false,
      userId: null,
      userEmail: null,
      accessToken: null,
      refreshToken: null,
      stealthScansUsed: 0,
      preferences: defaultPreferences,
      _syncVersion: 0,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setUserId: async (id, email) => {
        set({ userId: id, userEmail: email ?? null });

        if (id) {
          revenueCatService.login(id);
        }

        // Persist user data to secure storage
        const state = get();
        if (id && (email || state.userEmail)) {
          await saveUserData({
            userId: id,
            userEmail: email || state.userEmail || ""
          });
        } else if (!id) {
          await deleteUserData();
        }
      },
      setUserEmail: (email) => set({ userEmail: email }),
      setTokens: async (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        // Persist tokens to secure storage
        if (accessToken || refreshToken) {
          const current = await getAuthTokens();
          await saveAuthTokens({
            accessToken: accessToken || current?.accessToken || "",
            refreshToken: refreshToken || current?.refreshToken || ""
          });
        } else {
          await deleteAuthTokens();
        }
      },
      incrementStealthScans: () =>
        set((state) => ({ stealthScansUsed: state.stealthScansUsed + 1 })),
      resetStealthScans: () => set({ stealthScansUsed: 0 }),
      updatePreferences: (data) =>
        set((state) => ({
          preferences: { ...state.preferences, ...data },
          _syncVersion: state._syncVersion + 1
        })),
      setPreferences: (preferences) => set({ preferences, _syncVersion: 0 }),
      reset: async () => {
        await deleteAuthTokens();
        await deleteUserData();
        set({
          isAuthenticated: false,
          userId: null,
          userEmail: null,
          accessToken: null,
          refreshToken: null,
          stealthScansUsed: 0,
          preferences: defaultPreferences,
          _syncVersion: 0
        });
        await revenueCatService.logout();
      },
      initializeFromSecureStorage: async () => {
        // Load auth tokens from secure storage
        const tokens = await getAuthTokens();
        if (tokens) {
          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          });
        }

        // Load user data from secure storage
        const userData = await getUserData();
        if (userData) {
          set({
            userId: userData.userId,
            userEmail: userData.userEmail
          });
        }

        // Set authenticated state if we have tokens and user data
        const state = get();
        if (state.accessToken && state.userId) {
          set({ isAuthenticated: true });
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist non-sensitive data to AsyncStorage
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        preferences: state.preferences,
        stealthScansUsed: state.stealthScansUsed,
        _syncVersion: state._syncVersion
      })
    }
  )
);
