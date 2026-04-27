import { SettingsItem, SettingsSection } from "@components/settings";
import { Badge } from "@components/ui/Badge";
import { spacing } from "@constants/theme";
import { Bell, Mail, User } from "lucide-react-native";
import { View } from "react-native";

interface AccountSectionProps {
  userEmail: string | null;
  subscriptionTier: "free" | "premium";
  onNotificationSettingsPress: () => void;
  t: (key: string) => string;
}

export function AccountSection({
  userEmail,
  subscriptionTier,
  onNotificationSettingsPress,
  t
}: AccountSectionProps) {
  return (
    <SettingsSection title={t("settings.account")}>
      <View style={{ marginTop: spacing[3] }}>
        <SettingsItem
          icon={<User size={20} color="#4CAF82" />}
          label={t("settings.profile")}
          value={
            <Badge
              label={
                subscriptionTier === "premium"
                  ? t("settings.premium").toUpperCase()
                  : t("settings.free").toUpperCase()
              }
              variant={subscriptionTier === "premium" ? "primary" : "secondary"}
            />
          }
        />
      </View>
      <View style={{ marginTop: spacing[3] }}>
        <SettingsItem
          icon={<Mail size={20} color="#4CAF82" />}
          label={t("settings.email")}
          value={userEmail || t("settings.notLoggedIn")}
        />
      </View>
      <View style={{ marginTop: spacing[3] }}>
        <SettingsItem
          icon={<Bell size={20} color="#4CAF82" />}
          label={t("notificationSettings.title")}
          onPress={onNotificationSettingsPress}
        />
      </View>
    </SettingsSection>
  );
}
