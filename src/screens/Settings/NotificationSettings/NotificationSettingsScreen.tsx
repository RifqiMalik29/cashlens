import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { type SupportedApp } from "@stores/useNotificationStore";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AppSelectorList,
  PermissionStatusCard,
  TelegramStatusCard
} from "./components";
import { useNotificationSettings } from "./useNotificationSettings";

export default function NotificationSettingsScreen() {
  const {
    t,
    isFeatureEnabled,
    handleToggleFeature,
    hasPermission,
    handleOpenSettings,
    enabledPackages,
    togglePackage,
    SUPPORTED_APPS,
    isTelegramEnabled,
    handleToggleTelegram,
    isTelegramLinked,
    isLinking,
    handleConnectTelegram,
    handleDisconnectTelegram
  } = useNotificationSettings();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView className="flex-1 px-6 pt-4">
        <Typography
          variant="body"
          color={colors.textSecondary}
          className="mb-6"
        >
          {t("notificationSettings.subtitle")}
        </Typography>

        {/* Android Notification Toggle */}
        <Card className="p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Typography variant="body" weight="bold">
                {t("notificationSettings.enableFeature")}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {t("notificationSettings.enableFeatureDesc")}
              </Typography>
            </View>
            <Switch
              value={isFeatureEnabled}
              onValueChange={handleToggleFeature}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Telegram Bot Toggle */}
        <Card className="p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Typography variant="body" weight="bold">
                {t("notificationSettings.telegramBot")}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {t("notificationSettings.telegramBotDesc")}
              </Typography>
            </View>
            <Switch
              value={isTelegramEnabled}
              onValueChange={handleToggleTelegram}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Telegram Status */}
        {isTelegramEnabled && (
          <TelegramStatusCard
            isLinked={isTelegramLinked}
            isLinking={isLinking}
            linkedText={t("notificationSettings.telegramLinked")}
            notLinkedText={t("notificationSettings.telegramNotLinked")}
            connectText={t("notificationSettings.connectTelegram")}
            disconnectText={t("notificationSettings.disconnectTelegram")}
            onConnect={handleConnectTelegram}
            onDisconnect={handleDisconnectTelegram}
          />
        )}

        {/* Permission Status */}
        {isFeatureEnabled && (
          <PermissionStatusCard
            hasPermission={hasPermission}
            permissionGrantedText={t("notificationSettings.permissionGranted")}
            permissionDeniedText={t("notificationSettings.permissionDenied")}
            fixPermissionButtonText={t("notificationSettings.fixPermission")}
            onOpenSettings={handleOpenSettings}
          />
        )}

        {/* App Whitelist */}
        {isFeatureEnabled && (
          <AppSelectorList
            supportedApps={SUPPORTED_APPS as SupportedApp[]}
            enabledPackages={enabledPackages}
            onTogglePackage={togglePackage}
            selectAppsTitle={t("notificationSettings.selectApps")}
            selectAppsDesc={t("notificationSettings.selectAppsDesc")}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
