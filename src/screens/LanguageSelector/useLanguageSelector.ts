import { useHeader } from "@hooks/useHeader";
import i18n from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback } from "react";
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
  const router = useRouter();
  const { preferences, updatePreferences } = useAuthStore();
  const { t } = useTranslation();

  useHeader({
    title: t("settings.language"),
    statusBarStyle: "dark"
  });

  const handleSelectLanguage = useCallback(
    async (code: string) => {
      if (code === preferences.language) return;

      await Haptics.selectionAsync();
      updatePreferences({ language: code });
      i18n.changeLanguage(code);
      router.back();
    },
    [preferences.language, updatePreferences, router]
  );

  return {
    languages: LANGUAGES,
    currentLanguage: preferences.language,
    handleSelectLanguage
  };
}
