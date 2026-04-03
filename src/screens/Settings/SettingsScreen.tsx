/* eslint-disable max-lines */

import { useHeader } from "@hooks/useHeader";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Mail,
  Palette
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SyncStatusButton } from "@/components/ui/SyncIndicator";
import { Typography } from "@/components/ui/Typography";
import { currencies } from "@/constants/currencies";
import { colors, spacing } from "@/constants/theme";
import { useCloudSync } from "@/hooks/useCloudSync";
import i18n from "@/services/i18n";
import { signOut } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

interface SettingsItemProps {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  danger
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3"
      activeOpacity={0.7}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Typography
          variant="body"
          weight="medium"
          color={danger ? "#EF4444" : "#1A1A2E"}
        >
          {label}
        </Typography>
      </View>
      {value && (
        <Typography variant="body" color="#6B7280" style={{ marginRight: 8 }}>
          {value}
        </Typography>
      )}
      <ChevronRight size={20} color={danger ? "#EF4444" : "#9CA3AF"} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { reset, preferences, updatePreferences } = useAuthStore();
  const { pullData } = useCloudSync();
  const { t } = useTranslation();

  useHeader({
    showHeader: false,
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  const handleSignOut = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await signOut();
    reset();
    router.replace("/(auth)/login");
  };

  const handleForceSync = async () => {
    await Haptics.selectionAsync();
    await pullData();
  };

  const handleCurrencyPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/currency");
  };

  const handleCategoriesPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/categories");
  };

  const handleLanguagePress = async () => {
    await Haptics.selectionAsync();
    const newLang = preferences.language === "id" ? "en" : "id";
    updatePreferences({ language: newLang });
    i18n.changeLanguage(newLang);
  };

  const handleThemePress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/theme");
  };

  const handleHelpPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/help");
  };

  const currency = currencies.find((c) => c.code === preferences.baseCurrency);

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.primary }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="px-6 pt-6 pb-4"
          style={{ backgroundColor: colors.primary }}
        >
          <Typography variant="h2" weight="bold" color="#FFFFFF">
            {t("settings.title")}
          </Typography>
          <Typography variant="body" color="#FFFFFF">
            {t("settings.subtitle")}
          </Typography>
        </View>

        <View className="px-6 mt-4">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.cloudSync")}
          </Typography>
          <SyncStatusButton onPress={handleForceSync} />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.profile")}
          </Typography>
          <SettingsItem
            icon={<Mail size={20} color="#4CAF82" />}
            label={t("settings.email")}
            value="user@example.com"
          />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.finance")}
          </Typography>
          <SettingsItem
            icon={<CreditCard size={20} color="#4CAF82" />}
            label={t("settings.baseCurrency")}
            value={currency?.code || "IDR"}
            onPress={handleCurrencyPress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<LayoutGrid size={20} color="#4CAF82" />}
              label={t("settings.manageCategories")}
              onPress={handleCategoriesPress}
            />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.preferences")}
          </Typography>
          <SettingsItem
            icon={<Globe size={20} color="#4CAF82" />}
            label={t("settings.language")}
            value={preferences.language === "id" ? "Indonesia" : "English"}
            onPress={handleLanguagePress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<Palette size={20} color="#4CAF82" />}
              label={t("settings.theme")}
              value={
                preferences.theme === "system"
                  ? "Sistem"
                  : preferences.theme === "light"
                    ? "Terang"
                    : "Gelap"
              }
              onPress={handleThemePress}
            />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.support")}
          </Typography>
          <SettingsItem
            icon={<HelpCircle size={20} color="#4CAF82" />}
            label={t("settings.helpCenter")}
            onPress={handleHelpPress}
          />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.account")}
          </Typography>
          <SettingsItem
            icon={<LogOut size={20} color="#EF4444" />}
            label={t("settings.logout")}
            danger
            onPress={handleSignOut}
          />
          <View className="bg-surface-secondary rounded-lg p-4 mt-3">
            <Typography variant="caption" color="#6B7280">
              {t("auth.logoutConfirm")}
            </Typography>
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            {t("settings.about")}
          </Typography>
          <View className="bg-white border border-border rounded-lg px-4 py-3">
            <Typography variant="body" weight="medium" color="#1A1A2E">
              {t("common.appName")}
            </Typography>
            <Typography variant="caption" color="#6B7280">
              {t("settings.version")} 1.0.0
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
