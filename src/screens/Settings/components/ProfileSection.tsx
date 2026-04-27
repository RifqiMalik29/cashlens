import { SettingsSection } from "@components/settings";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { Crown, Zap } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  userEmail: string | null;
  subscriptionTier: "free" | "premium";
  expiresAt?: string | null;
  onUpgradePress: () => void;
  t: (key: string) => string;
}

function getInitials(email: string | null): string {
  if (!email) return "?";
  return email.charAt(0).toUpperCase();
}

function formatExpiry(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function ProfileSection({
  userEmail,
  subscriptionTier,
  expiresAt,
  onUpgradePress,
  t
}: ProfileSectionProps) {
  const colors = useColors();
  const isPremium = subscriptionTier === "premium";

  return (
    <SettingsSection title={t("settings.profile")}>
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border
        }}
      >
        <View
          className="px-5 pt-5 pb-4 items-center"
          style={{
            backgroundColor: isPremium
              ? colors.primaryLight
              : colors.surfaceSecondary
          }}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-3"
            style={{
              backgroundColor: isPremium ? colors.primary : colors.border
            }}
          >
            <Typography
              variant="h3"
              weight="bold"
              color={isPremium ? colors.white : colors.textSecondary}
            >
              {getInitials(userEmail)}
            </Typography>
          </View>

          <Typography
            variant="body"
            weight="bold"
            color={colors.textPrimary}
            style={{ textAlign: "center", marginBottom: 4 }}
          >
            {userEmail || t("settings.notLoggedIn")}
          </Typography>

          {isPremium ? (
            <View
              className="flex-row items-center px-3 py-1 rounded-full mt-1"
              style={{ backgroundColor: colors.primary }}
            >
              <Crown
                size={12}
                color={colors.white}
                style={{ marginRight: 4 }}
              />
              <Typography variant="caption" weight="bold" color={colors.white}>
                PREMIUM
              </Typography>
            </View>
          ) : (
            <View
              className="flex-row items-center px-3 py-1 rounded-full mt-1"
              style={{ backgroundColor: colors.border }}
            >
              <Typography
                variant="caption"
                weight="medium"
                color={colors.textSecondary}
              >
                FREE
              </Typography>
            </View>
          )}
        </View>

        {isPremium && expiresAt ? (
          <View
            className="px-5 py-3 items-center"
            style={{ borderTopWidth: 1, borderTopColor: colors.border }}
          >
            <Typography variant="caption" color={colors.textSecondary}>
              {t("settings.validUntil")} {formatExpiry(expiresAt)}
            </Typography>
          </View>
        ) : (
          <TouchableOpacity
            className="mx-4 my-4 py-3 rounded-xl flex-row items-center justify-center"
            style={{ backgroundColor: "#FEF3C7" }}
            onPress={onUpgradePress}
            activeOpacity={0.8}
          >
            <Zap size={16} color="#D97706" style={{ marginRight: 6 }} />
            <Typography variant="body" weight="bold" color="#D97706">
              {t("settings.upgrade")} — Unlock Premium
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </SettingsSection>
  );
}
