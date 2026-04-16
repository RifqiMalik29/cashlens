import { Button, Card, Typography } from "@components/ui";
import { colors, spacing } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { CheckCircle2, Zap } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUpgradeScreen } from "./useUpgradeScreen";

export default function UpgradeScreen() {
  const { t } = useTranslation();
  const {
    isLoading,
    error,
    selectedPlan,
    setSelectedPlan,
    handleSubscribe,
    features
  } = useUpgradeScreen();

  useHeader({
    title: t("upgrade.title")
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: spacing[8] }}
      >
        <View className="items-center py-6">
          <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-4">
            <Zap size={32} color={colors.warning} fill={colors.warning} />
          </View>
          <Typography variant="h2" weight="bold" className="text-center mb-2">
            {t("upgrade.headline")}
          </Typography>
          <Typography
            variant="bodyLarge"
            color="secondary"
            className="text-center px-4"
          >
            {t("upgrade.desc")}
          </Typography>
        </View>

        <View className="gap-3 mb-8">
          <TouchableOpacity
            onPress={() => setSelectedPlan("annual")}
            activeOpacity={0.8}
          >
            <Card
              className={`border-2 ${selectedPlan === "annual" ? "border-primary bg-primary/5" : "border-transparent"}`}
            >
              <View className="absolute -top-3 right-4 bg-amber-500 px-3 py-1 rounded-full z-10">
                <Typography variant="caption" weight="bold" color="white">
                  {t("upgrade.save28")}
                </Typography>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Typography variant="h4" weight="bold">
                  {t("upgrade.annualPlan")}
                </Typography>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedPlan === "annual" ? "border-primary" : "border-gray-300"}`}
                >
                  {selectedPlan === "annual" && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </View>
              </View>
              <Typography variant="h1" weight="bold" color="primary">
                Rp 129.000
              </Typography>
              <Typography variant="body" color="secondary">
                {t("upgrade.perYear")}
              </Typography>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPlan("monthly")}
            activeOpacity={0.8}
          >
            <Card
              className={`border-2 ${selectedPlan === "monthly" ? "border-primary bg-primary/5" : "border-transparent"}`}
            >
              <View className="flex-row justify-between items-center mb-1">
                <Typography variant="h4" weight="bold">
                  {t("upgrade.monthlyPlan")}
                </Typography>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedPlan === "monthly" ? "border-primary" : "border-gray-300"}`}
                >
                  {selectedPlan === "monthly" && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </View>
              </View>
              <Typography variant="h1" weight="bold">
                Rp 15.000
              </Typography>
              <Typography variant="body" color="secondary">
                {t("upgrade.perMonth")}
              </Typography>
            </Card>
          </TouchableOpacity>
        </View>

        <Typography variant="h4" weight="bold" className="mb-4">
          {t("upgrade.premiumFeatures")}
        </Typography>
        <View className="gap-3 mb-8">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <CheckCircle2 size={20} color={colors.primary} />
              <Typography variant="bodyLarge">{feature}</Typography>
            </View>
          ))}
        </View>

        {error && (
          <View className="bg-danger/10 p-3 rounded-lg mb-4">
            <Typography variant="body" color="danger" className="text-center">
              {error}
            </Typography>
          </View>
        )}

        <View className="mb-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              `${t("upgrade.subscribe")} ${selectedPlan === "annual" ? t("upgrade.annual") : t("upgrade.monthly")}`
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
