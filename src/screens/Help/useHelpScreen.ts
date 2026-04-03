import { useHeader } from "@hooks/useHeader";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export function useHelpScreen() {
  const { t } = useTranslation();

  useHeader({
    title: t("settings.help.title"),
    statusBarStyle: "dark"
  });

  const handleContactPress = async (_type: "email" | "whatsapp") => {
    await Haptics.selectionAsync();
    // Implementation for opening email or whatsapp if needed
  };

  return {
    t,
    handleContactPress
  };
}
