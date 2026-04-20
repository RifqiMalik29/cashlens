import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { authService } from "@services/authService";
import { notificationService } from "@services/notificationService";
import {
  SUPPORTED_APPS,
  useNotificationStore
} from "@stores/useNotificationStore";
import { logger } from "@utils/logger";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

export function useNotificationSettings() {
  const { t } = useTranslation();
  const {
    isFeatureEnabled,
    setFeatureEnabled,
    enabledPackages,
    togglePackage,
    isTelegramEnabled,
    setTelegramEnabled,
    isTelegramLinked,
    setTelegramLinked
  } = useNotificationStore();

  const [hasPermission, setHasPermission] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isDisconnectDialogVisible, setIsDisconnectDialogVisible] =
    useState(false);

  useHeader({
    title: t("notificationSettings.title"),
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  const checkPermission = useCallback(async () => {
    try {
      const granted = await notificationService.isPermissionGranted();
      setHasPermission(granted);
    } catch (error) {
      logger.error(
        "NotificationSettings",
        "Error checking permission",
        error as Error
      );
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const handleToggleFeature = (value: boolean) => {
    setFeatureEnabled(value);
  };

  const handleToggleTelegram = (value: boolean) => {
    setTelegramEnabled(value);
  };

  const handleOpenSettings = () => {
    notificationService.openNotificationSettings();
  };

  const handleConnectTelegram = async () => {
    setIsLinking(true);
    try {
      // In a real app, you would fetch a token from your Go Backend
      // const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/telegram/token`);
      // const { token } = await response.json();

      const mockToken = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
      const botUsername = "cashlens_tracker_bot";
      const url = `https://t.me/${botUsername}?start=${mockToken}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Telegram is not installed");
      }
    } catch (error) {
      logger.error(
        "NotificationSettings",
        "Error getting linking token",
        error as Error
      );
      Alert.alert(t("common.error"), t("notificationSettings.linkingError"));
    } finally {
      setIsLinking(false);
    }
  };

  const handleDisconnectTelegram = () => {
    setIsDisconnectDialogVisible(true);
  };

  const handleConfirmDisconnect = async () => {
    setIsDisconnectDialogVisible(false);
    setIsLinking(true);
    try {
      await authService.unlinkTelegram();
      setTelegramLinked(false);
    } catch (error) {
      logger.error(
        "NotificationSettings",
        "Error unlinking Telegram",
        error as Error
      );
      Alert.alert(t("common.error"), t("notificationSettings.linkingError"));
    } finally {
      setIsLinking(false);
    }
  };

  return {
    t,
    isFeatureEnabled,
    handleToggleFeature,
    hasPermission,
    handleOpenSettings,
    enabledPackages,
    togglePackage,
    SUPPORTED_APPS,
    checkPermission,
    // Telegram
    isTelegramEnabled,
    handleToggleTelegram,
    isTelegramLinked,
    isLinking,
    handleConnectTelegram,
    handleDisconnectTelegram,
    isDisconnectDialogVisible,
    setIsDisconnectDialogVisible,
    handleConfirmDisconnect
  };
}
