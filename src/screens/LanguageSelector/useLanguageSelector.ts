import { useHeader } from "@hooks/useHeader";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { authService } from "@services/authService";
import i18n from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { logger } from "@utils/logger";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧"
  }
];

export function useLanguageSelector() {
  const router = useProtectedRouter();
  const { preferences, updatePreferences } = useAuthStore();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  useHeader({
    title: t("settings.language"),
    statusBarStyle: "dark"
  });

  const handleSelectLanguage = useCallback(
    async (code: string) => {
      if (code === preferences.language || isUpdating) return;

      await Haptics.selectionAsync();
      setIsUpdating(true);

      try {
        // Update backend first, then local state on success
        await authService.updateLanguage(code);
        updatePreferences({ language: code });
        i18n.changeLanguage(code);
        router.back();
      } catch (error) {
        logger.error(
          "LanguageSelector",
          "Failed to update language:",
          error as Error
        );
        // Revert to previous language on failure
        i18n.changeLanguage(preferences.language);
      } finally {
        setIsUpdating(false);
      }
    },
    [preferences.language, updatePreferences, router, isUpdating]
  );

  return {
    languages: LANGUAGES,
    currentLanguage: preferences.language,
    handleSelectLanguage
  };
}
