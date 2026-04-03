import { SettingsItem, SettingsSection } from "@components/settings";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { Mail, MessageSquare } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHelpScreen } from "./useHelpScreen";

export default function HelpScreen() {
  const { t, handleContactPress } = useHelpScreen();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing[8] }}
      >
        <SettingsSection title={t("settings.help.faq")}>
          <View className="bg-white border border-border rounded-xl p-4 mb-3 shadow-sm">
            <Typography variant="body" weight="bold" color="#1A1A2E">
              {t("settings.help.howToScan")}
            </Typography>
            <Typography
              variant="caption"
              color="#6B7280"
              style={{ marginTop: 4 }}
            >
              {t("settings.help.howToScanDesc")}
            </Typography>
          </View>

          <View className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <Typography variant="body" weight="bold" color="#1A1A2E">
              {t("settings.help.howToBudget")}
            </Typography>
            <Typography
              variant="caption"
              color="#6B7280"
              style={{ marginTop: 4 }}
            >
              {t("settings.help.howToBudgetDesc")}
            </Typography>
          </View>
        </SettingsSection>

        <SettingsSection title={t("settings.help.contactSupport")}>
          <SettingsItem
            icon={<Mail size={20} color="#4CAF82" />}
            label="Email"
            value="support@cashlens.app"
            onPress={() => handleContactPress("email")}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<MessageSquare size={20} color="#4CAF82" />}
              label="WhatsApp"
              value="+62 812-3456-7890"
              onPress={() => handleContactPress("whatsapp")}
            />
          </View>
          <View className="bg-surface-secondary rounded-xl p-4 mt-4">
            <Typography
              variant="caption"
              color="#6B7280"
              style={{ textAlign: "center" }}
            >
              {t("settings.help.contactSupportDesc")}
            </Typography>
          </View>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
