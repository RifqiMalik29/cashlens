import { useHeader } from "@hooks/useHeader";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";

const SUPPORT_EMAIL = "support@cashlens.app";
const SUPPORT_WHATSAPP = "6281234567890"; // Format without + or dashes
const PRIVACY_POLICY_URL =
  "https://github.com/RifqiMalik29/cashlens/blob/main/docs/PRIVACY_POLICY.md";

export function useHelpScreen() {
  const { t } = useTranslation();

  useHeader({
    title: t("settings.help.title"),
    statusBarStyle: "dark"
  });

  const handleContactPress = async (type: "email" | "whatsapp") => {
    await Haptics.selectionAsync();
    const url =
      type === "email"
        ? `mailto:${SUPPORT_EMAIL}`
        : `https://wa.me/${SUPPORT_WHATSAPP}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {
      // Silently fail if the app can't be opened
    }
  };

  const handlePrivacyPolicyPress = async () => {
    await Haptics.selectionAsync();
    try {
      const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (supported) await Linking.openURL(PRIVACY_POLICY_URL);
    } catch {
      // Silently fail
    }
  };

  return {
    t,
    handleContactPress,
    handlePrivacyPolicyPress
  };
}
