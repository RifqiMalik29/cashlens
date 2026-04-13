import AsyncStorage from "@react-native-async-storage/async-storage";
import { subscriptionService } from "@services/api/subscriptionService";
import { logger } from "@utils/logger";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SubscriptionState {
  tier: "free" | "premium";
  expiresAt: string | null;
  quota: {
    transactionsUsed: number;
    transactionsLimit: number | null;
    scansUsed: number;
    scansLimit: number | null;
  };
  isLoading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  reset: () => void;
}

const defaultState = {
  tier: "free" as const,
  expiresAt: null,
  quota: {
    transactionsUsed: 0,
    transactionsLimit: 50,
    scansUsed: 0,
    scansLimit: 5
  },
  isLoading: false,
  error: null
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      ...defaultState,
      fetchSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await subscriptionService.getSubscription();
          set({
            tier: data.tier,
            expiresAt: data.expires_at,
            quota: {
              transactionsUsed: data.quota.transactions_used,
              transactionsLimit: data.quota.transactions_limit,
              scansUsed: data.quota.scans_used,
              scansLimit: data.quota.scans_limit
            },
            isLoading: false
          });
        } catch (error) {
          logger.error(
            "SubscriptionStore",
            "Failed to fetch subscription",
            error as Error
          );
          set({ isLoading: false, error: (error as Error).message });
        }
      },
      reset: () => set(defaultState)
    }),
    {
      name: "cashlens-subscription-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tier: state.tier,
        expiresAt: state.expiresAt,
        quota: state.quota
      })
    }
  )
);
