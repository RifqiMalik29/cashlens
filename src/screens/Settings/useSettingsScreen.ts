import { currencies } from "@constants/currencies";
import { colors } from "@constants/theme";
import { useCloudSync } from "@hooks/useCloudSync";
import { useHeader } from "@hooks/useHeader";
import { useSyncStatus } from "@hooks/useSyncStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "@services/supabase";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSyncStore } from "@stores/useSyncStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export interface SettingsDialogState {
  isVisible: boolean;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  primaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}

export function useSettingsScreen() {
  const router = useRouter();
  const { reset, preferences, userEmail } = useAuthStore();
  const { pullData, performSync, hasUnsyncedChanges } = useCloudSync();
  const { setLogoutSyncing, setManualSyncing } = useSyncStatus();
  const { t } = useTranslation();
  const [dialogState, setDialogState] = useState<SettingsDialogState>({
    isVisible: false,
    title: "",
    message: "",
    type: "info"
  });

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

  const handleNotificationSettingsPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/notifications");
  };

  const handleClearAllData = async () => {
    await Haptics.selectionAsync();

    setDialogState({
      isVisible: true,
      title: t("settings.clearDataConfirmTitle"),
      message: t("settings.clearDataConfirmDesc"),
      type: "warning",
      primaryButtonText: t("common.delete"),
      onPrimaryButtonPress: async () => {
        try {
          await AsyncStorage.clear();
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          setDialogState({
            isVisible: true,
            title: t("common.success"),
            message: t("settings.clearDataSuccess"),
            type: "success",
            primaryButtonText: t("common.confirm"),
            onPrimaryButtonPress: () => {
              setDialogState((prev) => ({ ...prev, isVisible: false }));
              router.replace("/(auth)/login");
            }
          });
        } catch {
          setDialogState({
            isVisible: true,
            title: t("common.error"),
            message: t("settings.clearDataError"),
            type: "error",
            primaryButtonText: t("common.confirm"),
            onPrimaryButtonPress: () =>
              setDialogState((prev) => ({ ...prev, isVisible: false }))
          });
        }
      },
      secondaryButtonText: t("common.cancel"),
      onSecondaryButtonPress: () =>
        setDialogState((prev) => ({ ...prev, isVisible: false }))
    });
  };

  return {
    t,
    userEmail,
    currentCurrency,
    languageDisplay,
    themeDisplay,
    dialogState,
    setDialogState,
    handleSignOut,
    handleForceSync,
    handleCurrencyPress,
    handleCategoriesPress,
    handleLanguagePress,
    handleThemePress,
    handleHelpPress,
    handleNotificationSettingsPress,
    handleClearAllData
  };
}
