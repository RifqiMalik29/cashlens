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
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { signOut } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSyncStore } from "@/stores/useSyncStore";
import { useTransactionStore } from "@/stores/useTransactionStore";

export function useSettingsScreen() {
  const router = useRouter();
  const { reset, preferences, userEmail } = useAuthStore();
  const { pullData, performSync, hasUnsyncedChanges } = useCloudSync();
  const { setLogoutSyncing, setManualSyncing } = useSyncStatus();
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

    try {
      // 1. Set global sync state to show overlay
      await setLogoutSyncing(true);

      // 2. Perform emergency sync if needed
      if (hasUnsyncedChanges) {
        await Promise.race([
          performSync(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Sync timeout")), 5000)
          )
        ]);
      } else {
        // Small delay for UI smoothness
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch {
      // Logout sync failed or timed out, continue with logout anyway
    }

    // 3. Clear data from Supabase session
    await signOut();

    // 4. Clear local data stores
    useTransactionStore.getState().clearTransactions();
    useBudgetStore.getState().clearBudgets();
    useCategoryStore.getState().resetToDefault();
    reset(); // auth store

    // 5. Navigate to login
    router.replace("/(auth)/login");

    // 6. FINALLY reset sync state (after navigation is triggered)
    // Small delay ensures the overlay stays during the screen transition
    setTimeout(() => {
      useSyncStore.getState().reset();
    }, 500);
  };

  const handleForceSync = async () => {
    await Haptics.selectionAsync();
    try {
      await setManualSyncing(true);
      // First push current changes
      await performSync();
      // Then pull latest data
      await pullData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      await setManualSyncing(false);
    }
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
