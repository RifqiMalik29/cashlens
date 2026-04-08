import {
  SettingsHeader,
  SettingsItem,
  SettingsSection
} from "@components/settings";
import { BaseDialog } from "@components/ui/BaseDialog";
import { SyncStatusButton } from "@components/ui/SyncIndicator";
import { Typography } from "@components/ui/Typography";
import { colors, spacing } from "@constants/theme";
import Constants from "expo-constants";
import {
  Bell,
  CreditCard,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Palette,
  RefreshCcw,
  Zap
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileSection } from "./components/ProfileSection";
import { useSettingsScreen } from "./useSettingsScreen";

export default function SettingsScreen() {
  const {
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
    subscriptionTier,
    setSubscriptionTier,
    stealthScansUsed,
    resetStealthScans
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
          onUpgradePress={() => setSubscriptionTier("premium")}
          t={t}
        />

        <SettingsSection title={t("settings.finance")}>
          <SettingsItem
            icon={<CreditCard size={20} color="#4CAF82" />}
            label={t("settings.baseCurrency")}
            value={currentCurrency?.code || "IDR"}
            onPress={handleCurrencyPress}
          />
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
        </SettingsSection>

        {/* Developer Section (DEV only) */}
        {__DEV__ && (
          <SettingsSection title={t("settings.developer")}>
            <View className="bg-white border border-border rounded-xl overflow-hidden">
              <SettingsItem
                icon={<Zap size={20} color="#F59E0B" />}
                label={`Toggle Tier (${subscriptionTier})`}
                onPress={() =>
                  setSubscriptionTier(
                    subscriptionTier === "premium" ? "free" : "premium"
                  )
                }
              />
              <View style={{ marginTop: spacing[3] }}>
                <SettingsItem
                  icon={<RefreshCcw size={20} color="#3B82F6" />}
                  label={`Reset Stealth Scans (${stealthScansUsed}/5)`}
                  onPress={resetStealthScans}
                />
              </View>
            </View>
          </SettingsSection>
        )}

        <SettingsSection title={t("settings.account")}>
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
        </SettingsSection>

        <SettingsSection title={t("settings.about")}>
          <View className="bg-white border border-border rounded-lg px-4 py-3">
            <Typography variant="body" weight="medium" color="#1A1A2E">
              {t("common.appName")}
            </Typography>
            <Typography variant="caption" color="#6B7280">
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
