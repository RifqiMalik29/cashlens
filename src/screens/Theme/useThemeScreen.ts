import { useHeader } from "@hooks/useHeader";
import { useAuthStore } from "@stores/useAuthStore";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useThemeScreen() {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = useAuthStore();

  useHeader({
    title: t("settings.themeScreen.title"),
    statusBarStyle: "dark"
  });

  const themes = useMemo(
    () => [
      { id: "light" as const, label: t("settings.light") },
      { id: "dark" as const, label: t("settings.dark") },
      { id: "system" as const, label: t("settings.system") }
    ],
    [t]
  );

  const handleThemeSelect = async (theme: "light" | "dark" | "system") => {
    if (theme === preferences.theme) return;

    await Haptics.selectionAsync();
    updatePreferences({ theme });
  };

  return {
    t,
    themes,
    currentTheme: preferences.theme,
    handleThemeSelect
  };
}
