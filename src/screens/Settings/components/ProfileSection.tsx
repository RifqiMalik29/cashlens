import { SettingsItem, SettingsSection } from "@components/settings";
import { Badge } from "@components/ui/Badge";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { Mail, User, Zap } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  userEmail: string | null;
  subscriptionTier: "free" | "premium";
  expiresAt?: string | null;
  onUpgradePress: () => void;
  t: (key: string) => string;
}

export function ProfileSection({
  userEmail,
  subscriptionTier,
  expiresAt,
  onUpgradePress,
  t
}: ProfileSectionProps) {
  const colors = useColors();
  return (
    <SettingsSection title={t("settings.profile")}>
      <View
        className="border border-border rounded-xl p-4"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.surfaceSecondary }}
            >
              <User size={24} color={colors.textPrimary} />
            </View>
            <View>
              <Typography variant="body" weight="bold">
                {userEmail || "User"}
              </Typography>
              {subscriptionTier === "premium" && expiresAt && (
                <View className="mt-1">
                  <Typography variant="caption" color="secondary">
                    {t("settings.validUntil")}{" "}
                    {new Date(expiresAt).toLocaleDateString("id-ID")}
                  </Typography>
                </View>
              )}
            </View>
          </View>
          {subscriptionTier === "free" ? (
            <TouchableOpacity
              className="bg-amber-100 px-3 py-2 rounded-lg flex-row items-center"
              onPress={onUpgradePress}
            >
              <Zap size={16} color="#D97706" className="mr-1" />
              <Typography variant="caption" weight="bold" color="#D97706">
                UPGRADE
              </Typography>
            </TouchableOpacity>
          ) : (
            <Badge label="PREMIUM ✓" variant="success" />
          )}
        </View>
        <SettingsItem
          icon={<Mail size={20} color="#4CAF82" />}
          label={t("settings.email")}
          value={userEmail || "Not logged in"}
        />
      </View>
    </SettingsSection>
  );
}
