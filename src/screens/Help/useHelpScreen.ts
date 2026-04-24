import { useHeader } from "@hooks/useHeader";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";

const SUPPORT_EMAIL = "cashlens.app@gmail.com";

export function useHelpScreen() {
  const { t } = useTranslation();
  const router = useProtectedRouter();

  useHeader({
    title: t("settings.help.title"),
    statusBarStyle: "dark"
  });

  const handleContactPress = async () => {
    await Haptics.selectionAsync();
    const url = `mailto:${SUPPORT_EMAIL}`;
    try {
      await Linking.openURL(url);
    } catch {
      // Silently fail if the app can't be opened
    }
  };

  const handlePrivacyPolicyPress = async () => {
    await Haptics.selectionAsync();
    router.push("/settings/privacy-policy");
  };

  return {
    t,
    handleContactPress,
    handlePrivacyPolicyPress
  };
}
