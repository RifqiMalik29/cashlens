import {
  ENTITLEMENT_ID,
  revenueCatService
} from "@services/subscriptionService";
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
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(
    null
  );
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [offeringsError, setOfferingsError] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">(
    "annual"
  );
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  useEffect(() => {
    const getOfferings = async () => {
      try {
        const result = await revenueCatService.getOfferings();
        if (result) {
          setOfferings(result);
        } else {
          setOfferingsError(true);
          setError(t("upgrade.error.fetchOfferings"));
        }
      } catch {
        setOfferingsError(true);
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

  const annualPack =
    offerings?.annual ??
    offerings?.availablePackages.find(
      (p) => p.packageType === "ANNUAL" || p.identifier === "annual"
    ) ??
    null;
  const monthlyPack =
    offerings?.monthly ??
    offerings?.availablePackages.find(
      (p) => p.packageType === "MONTHLY" || p.identifier === "monthly"
    ) ??
    null;
  const annualPrice = annualPack?.product.priceString ?? "—";
  const monthlyPrice = monthlyPack?.product.priceString ?? "—";

  const handleSubscribe = async () => {
    if (!offerings) return;

    setIsLoading(true);

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
        setPaymentStatus("success");
      }
    } catch (e) {
      const purchaseError = e as PurchasesError;
      if (!purchaseError.userCancelled) {
        logger.error("UpgradeScreen", "Failed to purchase", e);
        setPaymentErrorMessage(purchaseError.message ?? null);
        setPaymentStatus("failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPaymentStatus = () => {
    setPaymentStatus("idle");
    setPaymentErrorMessage(null);
  };

  const handleRestore = async () => {
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined) {
        setPaymentStatus("success");
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

  const offeringsLoading = !annualPack && !monthlyPack && !offeringsError;

  return {
    isLoading,
    error,
    setError,
    paymentStatus,
    paymentErrorMessage,
    resetPaymentStatus,
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
