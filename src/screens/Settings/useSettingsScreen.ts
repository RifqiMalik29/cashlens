import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { currencies } from "@/constants/currencies";
import { colors } from "@/constants/theme";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useHeader } from "@/hooks/useHeader";
import { signOut } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export function useSettingsScreen() {
  const router = useRouter();
  const { reset, preferences, userEmail } = useAuthStore();
  const { pullData } = useCloudSync();
  const { t } = useTranslation();

  useHeader({
    showHeader: false,
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  const currentCurrency = useMemo(
    () => currencies.find((c) => c.code === preferences.baseCurrency),
    [preferences.baseCurrency]
  );

  const languageDisplay = useMemo(
    () => (preferences.language === "id" ? "Indonesia" : "English"),
    [preferences.language]
  );

  const themeDisplay = useMemo(() => {
    if (preferences.theme === "system") return "Sistem";
    if (preferences.theme === "light") return "Terang";
    return "Gelap";
  }, [preferences.theme]);

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
    router.push("/(tabs)/settings/language");
  };

  const handleThemePress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/theme");
  };

  const handleHelpPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/help");
  };

  return {
    t,
    userEmail,
    currentCurrency,
    languageDisplay,
    themeDisplay,
    handleSignOut,
    handleForceSync,
    handleCurrencyPress,
    handleCategoriesPress,
    handleLanguagePress,
    handleThemePress,
    handleHelpPress
  };
}
