import { Button } from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import {
  BadgeCheck,
  Bell,
  Crown,
  FolderOpen,
  Headphones,
  ScanLine,
  Sparkles
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    offeringsLoading
  } = useUpgradeScreen();

  useHeader({ title: t("upgrade.title") });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
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

        {/* Features */}
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

        {/* Plan selector */}
        {offeringsLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View className="flex-row mb-4" style={{ gap: 12 }}>
            {/* Annual */}
            <TouchableOpacity
              onPress={() => setSelectedPlan("annual")}
              activeOpacity={0.8}
              className="flex-1 rounded-xl p-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor:
                  selectedPlan === "annual" ? colors.primary : colors.border
              }}
            >
              {savingsPct != null && (
                <View
                  className="rounded-full px-2 py-0.5 mb-2 self-start"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={colors.primary}
                  >
                    {t("upgrade.savePct", { pct: savingsPct })}
                  </Typography>
                </View>
              )}
              <Typography
                variant="body"
                weight="semibold"
                color={colors.textPrimary}
              >
                {t("upgrade.annual")}
              </Typography>
              <Typography variant="h4" weight="bold" color={colors.primary}>
                {annualPrice}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {t("upgrade.perYear")}
              </Typography>
              {annualPerMonth && (
                <Typography
                  variant="caption"
                  color={colors.textSecondary}
                  style={{ marginTop: 2 }}
                >
                  {annualPerMonth}
                </Typography>
              )}
            </TouchableOpacity>

            {/* Monthly */}
            <TouchableOpacity
              onPress={() => setSelectedPlan("monthly")}
              activeOpacity={0.8}
              className="flex-1 rounded-xl p-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor:
                  selectedPlan === "monthly" ? colors.primary : colors.border
              }}
            >
              <View style={{ height: 24, marginBottom: 2 }} />
              <Typography
                variant="body"
                weight="semibold"
                color={colors.textPrimary}
              >
                {t("upgrade.monthly")}
              </Typography>
              <Typography variant="h4" weight="bold" color={colors.textPrimary}>
                {monthlyPrice}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {t("upgrade.perMonth")}
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Error */}
        {error && (
          <View className="rounded-lg px-4 py-3 mb-4 bg-red-50">
            <Typography variant="caption" color={colors.error}>
              {error}
            </Typography>
          </View>
        )}

        {/* CTA */}
        <Button
          onPress={handleSubscribe}
          loading={isLoading}
          disabled={isLoading || offeringsLoading}
          fullWidth
          size="lg"
        >
          {t("upgrade.subscribe")}
        </Button>

        {/* Restore */}
        <TouchableOpacity
          onPress={handleRestore}
          activeOpacity={0.7}
          className="items-center mt-4 py-2"
        >
          <Typography variant="caption" color={colors.textSecondary}>
            {t("upgrade.restore")}
          </Typography>
        </TouchableOpacity>

        {/* Terms */}
        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={{ textAlign: "center", marginTop: 8, lineHeight: 16 }}
        >
          {t("upgrade.terms")}
        </Typography>
      </ScrollView>
    </SafeAreaView>
  );
}
