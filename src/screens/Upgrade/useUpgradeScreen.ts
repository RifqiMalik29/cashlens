import {
  type CreateInvoiceRequest,
  subscriptionService
} from "@services/api/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { logger } from "@utils/logger";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useUpgradeScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<CreateInvoiceRequest["plan"]>("annual");
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  const features = [
    t("upgrade.feature1"),
    t("upgrade.feature2"),
    t("upgrade.feature3"),
    t("upgrade.feature4"),
    t("upgrade.feature5")
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await subscriptionService.createInvoice(selectedPlan);

      const result = await WebBrowser.openBrowserAsync(response.payment_url);

      // Android returns "opened" immediately — the deep link handler in
      // payment/success.tsx calls fetchSubscription on mount.
      // iOS blocks until closed (cancel/dismiss) — verify + fetch here.
      if (result.type === "cancel" || result.type === "dismiss") {
        try {
          await subscriptionService.verifySubscription(response.invoice_id);
        } catch (verifyErr) {
          logger.warn(
            "UpgradeScreen",
            "Verify returned error, fetching subscription anyway:",
            verifyErr as Error
          );
        }
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
    handleSubscribe,
    features
  };
}
