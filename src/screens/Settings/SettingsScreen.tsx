import {
  CreditCard,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Mail,
  Palette
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SettingsHeader,
  SettingsItem,
  SettingsSection
} from "@/components/settings";
import { SyncStatusButton } from "@/components/ui/SyncIndicator";
import { Typography } from "@/components/ui/Typography";
import { colors, spacing } from "@/constants/theme";

import { useSettingsScreen } from "./useSettingsScreen";

export default function SettingsScreen() {
  const {
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
    handleHelpPress
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

        <SettingsSection title={t("settings.profile")}>
          <SettingsItem
            icon={<Mail size={20} color="#4CAF82" />}
            label={t("settings.email")}
            value={userEmail || "Not logged in"}
          />
        </SettingsSection>

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
            label={t("settings.helpCenter")}
            onPress={handleHelpPress}
          />
        </SettingsSection>

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
              {t("settings.version")} 1.0.0
            </Typography>
          </View>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
