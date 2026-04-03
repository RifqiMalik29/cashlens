import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { currencies } from "@/constants/currencies";
import { colors } from "@/constants/theme";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useHeader } from "@/hooks/useHeader";
import { signOut } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";

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

    // Clear all stores to prevent data leakage between users
    reset(); // auth store
    useTransactionStore.getState().clearTransactions();
    useBudgetStore.getState().clearBudgets();
    useCategoryStore.getState().resetToDefault();

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

  const handleClearAllData = async () => {
    await Haptics.selectionAsync();

    Alert.alert(
      "Hapus Semua Data Lokal",
      "Ini akan menghapus semua data lokal (transaksi, anggaran, kategori, dll). Data di Supabase tidak akan terpengaruh. Anda harus login ulang setelah ini.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert(
                "Berhasil",
                "Data lokal berhasil dihapus. Aplikasi akan restart.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Force app to restart by navigating to root
                      router.replace("/(auth)/login");
                    }
                  }
                ]
              );
            } catch {
              Alert.alert("Error", "Gagal menghapus data lokal");
            }
          }
        }
      ]
    );
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
    handleHelpPress,
    handleClearAllData
  };
}
