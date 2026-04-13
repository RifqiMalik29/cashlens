import {
  type CreateInvoiceRequest,
  subscriptionService
} from "@services/api/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { logger } from "@utils/logger";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

export function useUpgradeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<CreateInvoiceRequest["plan"]>("annual");
  const { fetchSubscription } = useSubscriptionStore();

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await subscriptionService.createInvoice(selectedPlan);

      // Open the payment URL in the in-app browser
      const result = await WebBrowser.openBrowserAsync(response.payment_url);

      // When the browser is closed, we refresh the subscription state to see if they paid
      if (result.type === "cancel" || result.type === "dismiss") {
        await fetchSubscription();
      }
    } catch (err) {
      logger.error("UpgradeScreen", "Failed to create invoice", err as Error);
      setError("Gagal membuat tagihan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    selectedPlan,
    setSelectedPlan,
    handleSubscribe
  };
}
