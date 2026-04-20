import { useHeader } from "@hooks/useHeader";
import { ENTITLEMENT_ID } from "@services/subscriptionService";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { CustomerInfo } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

export default function UpgradeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const fetchSubscription = useSubscriptionStore(
    (state) => state.fetchSubscription
  );

  useHeader({ title: t("upgrade.title") });

  const handlePurchaseOrRestoreCompleted = async ({
    customerInfo
  }: {
    customerInfo: CustomerInfo;
  }) => {
    if (customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined) {
      await fetchSubscription();
      router.back();
    }
  };

  return (
    <RevenueCatUI.Paywall
      onDismiss={() => router.back()}
      onPurchaseCompleted={handlePurchaseOrRestoreCompleted}
      onRestoreCompleted={handlePurchaseOrRestoreCompleted}
    />
  );
}
