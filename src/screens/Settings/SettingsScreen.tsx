import {
  SettingsHeader,
  SettingsItem,
  SettingsSection
} from "@components/settings";
import { BaseDialog } from "@components/ui/BaseDialog";
import { SyncStatusButton } from "@components/ui/SyncIndicator";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import Constants from "expo-constants";
import {
  Bell,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Palette,
  RefreshCcw,
  Trash2
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileSection } from "./components/ProfileSection";
import { useSettingsScreen } from "./useSettingsScreen";

export default function SettingsScreen() {
  const colors = useColors();
  const {
    t,
    userEmail,
    languageDisplay,
    themeDisplay,
    dialogState,
    setDialogState,
    handleSignOut,
    handleDeleteAccount,
    handleForceSync,
    handleCategoriesPress,
    handleLanguagePress,
    handleThemePress,
    handleHelpPress,
    handleNotificationSettingsPress,
    handleUpgradePress,
    subscriptionTier,
    expiresAt
  } = useSettingsScreen();
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
        <SettingsHeader
          title={t("settings.title")}
          subtitle={t("settings.subtitle")}
        />

        <SettingsSection title={t("settings.cloudSync")}>
          <SyncStatusButton onPress={handleForceSync} />
        </SettingsSection>

        <ProfileSection
          userEmail={userEmail}
          subscriptionTier={subscriptionTier}
          expiresAt={expiresAt}
          onUpgradePress={handleUpgradePress}
          t={t}
        />

        <SettingsSection title={t("settings.finance")}>
          {/* DISABLED FOR EARLY ACCESS */}
          {/* <SettingsItem
            icon={<CreditCard size={20} color="#4CAF82" />}
            label={t("settings.baseCurrency")}
            value={currentCurrency?.code || "IDR"}
            onPress={handleCurrencyPress}
          /> */}
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<LayoutGrid size={20} color="#4CAF82" />}
              label={t("settings.manageCategories")}
              onPress={handleCategoriesPress}
            />
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.preferences")}>
          <SettingsItem
            icon={<Globe size={20} color="#4CAF82" />}
            label={t("settings.language")}
            value={languageDisplay}
            onPress={handleLanguagePress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<Palette size={20} color="#4CAF82" />}
              label={t("settings.theme")}
              value={themeDisplay}
              onPress={handleThemePress}
            />
          </View>
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<Bell size={20} color="#4CAF82" />}
              label={t("notificationSettings.title")}
              onPress={handleNotificationSettingsPress}
            />
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.support")}>
          <SettingsItem
            icon={<HelpCircle size={20} color="#4CAF82" />}
            label={t("settings.helpCenter")}
            onPress={handleHelpPress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<RefreshCcw size={20} color="#4CAF82" />}
              label={t("settings.manageSubscription")}
              onPress={() => RevenueCatUI.presentCustomerCenter()}
            />
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.account")}>
          <SettingsItem
            icon={<LogOut size={20} color="#EF4444" />}
            label={t("settings.logout")}
            danger
            onPress={handleSignOut}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<Trash2 size={20} color="#EF4444" />}
              label={t("settings.deleteAccount")}
              danger
              onPress={handleDeleteAccount}
            />
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.about")}>
          <View
            className="border border-border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface }}
          >
            <Typography variant="body" weight="medium">
              {t("common.appName")}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              {t("settings.version")} {Constants.expoConfig?.version ?? "1.0.0"}
            </Typography>
          </View>
        </SettingsSection>
      </ScrollView>

      <BaseDialog
        isVisible={dialogState.isVisible}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        primaryButtonText={dialogState.primaryButtonText}
        onPrimaryButtonPress={dialogState.onPrimaryButtonPress}
        secondaryButtonText={dialogState.secondaryButtonText}
        onSecondaryButtonPress={dialogState.onSecondaryButtonPress}
        onClose={() =>
          setDialogState((prev) => ({ ...prev, isVisible: false }))
        }
      />
    </SafeAreaView>
  );
}
