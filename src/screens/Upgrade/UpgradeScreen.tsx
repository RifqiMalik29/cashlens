import { Button } from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import {
  AlertCircle,
  BadgeCheck,
  Bell,
  Crown,
  FolderOpen,
  Headphones,
  ScanLine,
  Sparkles,
  X
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaymentResultModal } from "./PaymentResultModal";
import { PlanCard } from "./PlanCard";
import { useUpgradeScreen } from "./useUpgradeScreen";

const FEATURE_ICONS = [
  <BadgeCheck key="badge-check" size={18} color={colors.primary} />,
  <ScanLine key="scan-line" size={18} color={colors.primary} />,
  <Bell key="bell" size={18} color={colors.primary} />,
  <FolderOpen key="folder-open" size={18} color={colors.primary} />,
  <Headphones key="headphones" size={18} color={colors.primary} />
];

export default function UpgradeScreen() {
  const { t } = useTranslation();
  const {
    isLoading,
    error,
    selectedPlan,
    setSelectedPlan,
    handleSubscribe,
    features,
    handleRestore,
    annualPrice,
    monthlyPrice,
    savingsPct,
    annualPerMonth,
    offeringsLoading,
    setError,
    paymentStatus,
    paymentErrorMessage,
    resetPaymentStatus
  } = useUpgradeScreen();

  useHeader({ title: t("upgrade.title") });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-6 pb-4">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Crown size={32} color={colors.primary} />
          </View>
          <Typography variant="h2" weight="bold" color={colors.textPrimary}>
            {t("upgrade.headline")}
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: "center", marginTop: 8 }}
          >
            {t("upgrade.desc")}
          </Typography>
        </View>

        <View
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
            <Sparkles size={16} color={colors.primary} />
            <Typography
              variant="body"
              weight="semibold"
              color={colors.textPrimary}
            >
              {t("upgrade.premiumFeatures")}
            </Typography>
          </View>
          {features.map((feat, i) => (
            <View
              key={i}
              className="flex-row items-center"
              style={{ gap: 10, paddingVertical: 6 }}
            >
              {FEATURE_ICONS[i]}
              <Typography variant="body" color={colors.textPrimary}>
                {feat}
              </Typography>
            </View>
          ))}
        </View>

        {offeringsLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View className="flex-row mb-4" style={{ gap: 12 }}>
            <PlanCard
              plan="annual"
              selected={selectedPlan === "annual"}
              onPress={() => setSelectedPlan("annual")}
              price={annualPrice}
              label={t("upgrade.annual")}
              sublabel={t("upgrade.perYear")}
              badge={
                savingsPct != null
                  ? t("upgrade.savePct", { pct: savingsPct })
                  : null
              }
              perMonth={annualPerMonth}
            />
            <PlanCard
              plan="monthly"
              selected={selectedPlan === "monthly"}
              onPress={() => setSelectedPlan("monthly")}
              price={monthlyPrice}
              label={t("upgrade.monthly")}
              sublabel={t("upgrade.perMonth")}
            />
          </View>
        )}

        {error && (
          <View
            className="rounded-xl px-4 py-3 mb-4 flex-row items-start"
            style={{ backgroundColor: "#FEF2F2", gap: 10 }}
          >
            <AlertCircle
              size={18}
              color={colors.error}
              style={{ marginTop: 1 }}
            />
            <Typography
              variant="body"
              color={colors.error}
              style={{ flex: 1, fontWeight: "500" }}
            >
              {error}
            </Typography>
            <TouchableOpacity onPress={() => setError(null)} hitSlop={8}>
              <X size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

        <Button
          onPress={handleSubscribe}
          loading={isLoading}
          disabled={isLoading || offeringsLoading}
          fullWidth
          size="lg"
        >
          {t("upgrade.subscribe")}
        </Button>

        <TouchableOpacity
          onPress={handleRestore}
          activeOpacity={0.7}
          className="items-center mt-4 py-2"
        >
          <Typography variant="caption" color={colors.textSecondary}>
            {t("upgrade.restore")}
          </Typography>
        </TouchableOpacity>

        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={{ textAlign: "center", marginTop: 8, lineHeight: 16 }}
        >
          {t("upgrade.terms")}
        </Typography>
      </ScrollView>
      <PaymentResultModal
        status={paymentStatus}
        errorMessage={paymentErrorMessage}
        onDismiss={resetPaymentStatus}
      />
    </SafeAreaView>
  );
}
