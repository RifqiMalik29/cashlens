import { currencies } from "@constants/currencies";
import { colors } from "@constants/theme";
import { useCloudSync } from "@hooks/useCloudSync";
import { useHeader } from "@hooks/useHeader";
import { useSyncStatus } from "@hooks/useSyncStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@stores/useAuthStore";
import { logger } from "@utils/logger";
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
  const {
    reset,
    preferences,
    userEmail,
    subscriptionTier,
    setSubscriptionTier,
    stealthScansUsed,
    resetStealthScans
  } = useAuthStore();
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

  const currentCurrency = useMemo(() => {
    return (
      currencies.find((c) => c.code === preferences.baseCurrency) ||
      currencies[0]
    );
  }, [preferences.baseCurrency]);

  const languageDisplay = useMemo(() => {
    return preferences.language === "id" ? "Bahasa Indonesia" : "English";
  }, [preferences.language]);

  const themeDisplay = useMemo(() => {
    switch (preferences.theme) {
      case "light":
        return t("settings.light");
      case "dark":
        return t("settings.dark");
      default:
        return t("settings.system");
    }
  }, [preferences.theme, t]);

  const handleSignOut = async () => {
    await Haptics.selectionAsync();

    setDialogState({
      isVisible: true,
      title: t("auth.logoutConfirm"),
      message: hasUnsyncedChanges
        ? "Ada perubahan yang belum tersinkronisasi. Tetap keluar?"
        : "Apakah Anda yakin ingin keluar?",
      type: "warning",
      primaryButtonText: t("settings.logout"),
      onPrimaryButtonPress: async () => {
        setDialogState((prev) => ({ ...prev, isVisible: false }));
        setLogoutSyncing(true);
        try {
          if (hasUnsyncedChanges) {
            await performSync();
          }
          reset();
          router.replace("/(auth)/login");
        } catch (error) {
          logger.error("Settings", "Sign out error", error as Error);
        } finally {
          setLogoutSyncing(false);
        }
      },
      secondaryButtonText: t("common.cancel"),
      onSecondaryButtonPress: () =>
        setDialogState((prev) => ({ ...prev, isVisible: false }))
    });
  };

  const handleForceSync = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setManualSyncing(true);
    try {
      await pullData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      logger.error("Settings", "Manual sync error", error as Error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setManualSyncing(false);
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
    handleClearAllData,
    subscriptionTier,
    setSubscriptionTier,
    stealthScansUsed,
    resetStealthScans
  };
}
