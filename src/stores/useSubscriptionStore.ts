import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENTITLEMENT_ID } from "@services/subscriptionService";
import { logger } from "@utils/logger";
import Purchases from "react-native-purchases";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SubscriptionState {
  tier: "free" | "premium";
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  reset: () => void;
}

const defaultState = {
  tier: "free" as const,
  expiresAt: null,
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
          const customerInfo = await Purchases.getCustomerInfo();
          const premiumEntitlement =
            customerInfo.entitlements.active[ENTITLEMENT_ID];
          set({
            tier: premiumEntitlement !== undefined ? "premium" : "free",
            expiresAt: premiumEntitlement?.expirationDate ?? null,
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
        expiresAt: state.expiresAt
      })
    }
  )
);
