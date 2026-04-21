import { currencies } from "@constants/currencies";
import { colors } from "@constants/theme";
import { usePullData } from "@hooks/useCloudSync";
import { useHeader } from "@hooks/useHeader";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useSyncStatus } from "@hooks/useSyncStatus";
import { authService } from "@services/authService";
import { revenueCatService } from "@services/subscriptionService";
import { useAuthStore } from "@stores/useAuthStore";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { type SettingsDialogState } from "@types";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

export function useSettingsScreen() {
  const router = useProtectedRouter();
  const { reset, preferences, userEmail, stealthScansUsed, resetStealthScans } =
    useAuthStore();
  const {
    tier: subscriptionTier,
    expiresAt,
    fetchSubscription
  } = useSubscriptionStore();
  const pullData = usePullData();
  const { setLogoutSyncing, setManualSyncing } = useSyncStatus();
  const { t } = useTranslation();
  const [isRestoring, setIsRestoring] = useState(false);
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
    () =>
      currencies.find((c) => c.code === preferences.baseCurrency) ||
      currencies[0],
    [preferences.baseCurrency]
  );

  const languageDisplay = useMemo(
    () => (preferences.language === "id" ? "Bahasa Indonesia" : "English"),
    [preferences.language]
  );

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
      message: "Apakah Anda yakin ingin keluar?",
      type: "warning",
      primaryButtonText: t("settings.logout"),
      onPrimaryButtonPress: async () => {
        setDialogState((prev) => ({ ...prev, isVisible: false }));
        setLogoutSyncing(true);
        try {
          await authService.logout();
        } catch (error) {
          // Continue with local logout even if backend logout fails
          // eslint-disable-next-line no-console
          console.error("Backend logout failed:", error);
        } finally {
          // Always reset local state regardless of backend logout success
          reset();
          router.replace("/(auth)/login");
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
      // eslint-disable-next-line no-console
      console.error("Manual sync error:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setManualSyncing(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    await Haptics.selectionAsync();
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      // This will be called if `restorePurchases` is successful.
      // A cross-platform alert will be posted by the RevenueCat SDK as well.
      await fetchSubscription();
      const isSubscribed =
        customerInfo.entitlements.active.premium !== undefined;

      setDialogState({
        isVisible: true,
        title: isSubscribed
          ? t("restore.successTitle")
          : t("restore.notFoundTitle"),
        message: isSubscribed
          ? t("restore.successMessage")
          : t("restore.notFoundMessage"),
        type: isSubscribed ? "success" : "info",
        primaryButtonText: t("common.ok"),
        onPrimaryButtonPress: () =>
          setDialogState((prev) => ({ ...prev, isVisible: false }))
      });
    } catch {
      setDialogState({
        isVisible: true,
        title: t("common.error"),
        message:
          Platform.OS === "ios"
            ? t("restore.errorIOS")
            : t("restore.errorAndroid"),
        type: "error",
        primaryButtonText: t("common.ok"),
        onPrimaryButtonPress: () =>
          setDialogState((prev) => ({ ...prev, isVisible: false }))
      });
    } finally {
      setIsRestoring(false);
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

  const handleUpgradePress = async () => {
    await Haptics.selectionAsync();
    router.push("/upgrade" as never);
  };

  const handleDeleteAccount = async () => {
    await Haptics.selectionAsync();

    setDialogState({
      isVisible: true,
      title: "Hapus Akun",
      message:
        "Akun dan semua data Anda akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.",
      type: "error",
      primaryButtonText: "Hapus Akun",
      onPrimaryButtonPress: async () => {
        setDialogState((prev) => ({ ...prev, isVisible: false }));
        try {
          await authService.deleteAccount();
        } catch {
          // Continue with local reset even if backend call fails
        } finally {
          await reset();
          router.replace("/(auth)/login");
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
    handleDeleteAccount,
    handleForceSync,
    handleRestorePurchases,
    isRestoring,
    handleCurrencyPress,
    handleCategoriesPress,
    handleLanguagePress,
    handleThemePress,
    handleHelpPress,
    handleNotificationSettingsPress,
    handleUpgradePress,
    subscriptionTier,
    expiresAt,
    stealthScansUsed,
    resetStealthScans
  };
}
