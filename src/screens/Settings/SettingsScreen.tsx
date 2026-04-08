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
  CreditCard,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Palette,
  RefreshCcw
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountSection } from "./components/AccountSection";
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
    handleClearAllData
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

        <AccountSection
          userEmail={userEmail}
          subscriptionTier="free"
          onNotificationSettingsPress={handleNotificationSettingsPress}
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
        </SettingsSection>

        <SettingsSection title={t("settings.support")}>
          <SettingsItem
            icon={<HelpCircle size={20} color="#4CAF82" />}
            label={t("settings.help")}
            onPress={handleHelpPress}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.dataManagement")}>
          <SettingsItem
            icon={<RefreshCcw size={20} color="#4CAF82" />}
            label={t("settings.clearAllData")}
            onPress={handleClearAllData}
            danger
          />
        </SettingsSection>

        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[4] }}>
          <SettingsItem
            icon={<LogOut size={20} color="#EF4444" />}
            label={t("settings.signOut")}
            onPress={handleSignOut}
            danger
          />
        </View>

        <View className="items-center mt-8 mb-4">
          <Typography variant="caption" color={colors.textSecondary}>
            v{Constants.expoConfig?.version || "1.0.0"}
          </Typography>
        </View>
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
