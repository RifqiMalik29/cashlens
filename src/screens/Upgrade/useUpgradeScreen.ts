import { ENTITLEMENT_ID, revenueCatService } from "@services/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { logger } from "@utils/logger";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  PurchasesError,
  PurchasesOffering,
  PurchasesPackage
} from "react-native-purchases";

export function useUpgradeScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">(
    "annual"
  );
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const offerings = await revenueCatService.getOfferings();
        if (offerings) {
          setOfferings(offerings);
        }
      } catch {
        setError(t("upgrade.error.fetchOfferings"));
      }
    };
    getOfferings();
  }, [t]);

  const features = [
    t("upgrade.feature1"),
    t("upgrade.feature2"),
    t("upgrade.feature3"),
    t("upgrade.feature4"),
    t("upgrade.feature5")
  ];

  const annualPack = offerings?.availablePackages.find(
    (p) => p.identifier === "annual"
  );
  const monthlyPack = offerings?.availablePackages.find(
    (p) => p.identifier === "monthly"
  );

  const handleSubscribe = async () => {
    if (!offerings) return;

    setIsLoading(true);
    setError(null);

    const pack = selectedPlan === "annual" ? annualPack : monthlyPack;

    if (!pack) {
      setError(t("upgrade.error.planNotFound"));
      setIsLoading(false);
      return;
    }

    try {
      const { customerInfo } = await revenueCatService.purchasePackage(
        pack as PurchasesPackage
      );
      if (customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined) {
        await fetchSubscription();
      }
    } catch (e) {
      const error = e as PurchasesError;
      if (!error.userCancelled) {
        logger.error("UpgradeScreen", "Failed to purchase", e);
        setError(t("upgrade.error.purchase"));
      }
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
    features,
    annualPack,
    monthlyPack
  };
}