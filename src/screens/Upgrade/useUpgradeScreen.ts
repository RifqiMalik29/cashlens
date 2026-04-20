import {
  ENTITLEMENT_ID,
  revenueCatService
} from "@services/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { logger } from "@utils/logger";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  PurchasesError,
  PurchasesOffering,
  PurchasesPackage
} from "react-native-purchases";

export function useUpgradeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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

  const annualPack = offerings?.annual;
  const monthlyPack = offerings?.monthly;
  const annualPrice = annualPack?.product.priceString ?? "—";
  const monthlyPrice = monthlyPack?.product.priceString ?? "—";

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
        router.back();
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

  const handleRestore = async () => {
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined) {
        router.back();
      }
    } catch {
      // silent
    }
  };

  const annualMonthlyEquiv = annualPack ? annualPack.product.price / 12 : null;
  const monthlyRaw = monthlyPack?.product.price ?? null;
  const savingsPct =
    annualMonthlyEquiv && monthlyRaw && monthlyRaw > 0
      ? Math.round((1 - annualMonthlyEquiv / monthlyRaw) * 100)
      : null;
  const currencySymbol =
    annualPack?.product.currencyCode === "IDR"
      ? "Rp"
      : (annualPack?.product.currencyCode ?? "");
  const annualPerMonth =
    annualMonthlyEquiv != null
      ? `${currencySymbol}${Math.round(annualMonthlyEquiv).toLocaleString()}${t("upgrade.perMonth")}`
      : null;

  const offeringsLoading = !annualPack && !monthlyPack && !error;

  return {
    isLoading,
    error,
    selectedPlan,
    setSelectedPlan,
    handleSubscribe,
    features,
    annualPack,
    monthlyPack,
    handleRestore,
    annualPrice,
    monthlyPrice,
    annualMonthlyEquiv,
    monthlyRaw,
    savingsPct,
    currencySymbol,
    annualPerMonth,
    offeringsLoading
  };
}
