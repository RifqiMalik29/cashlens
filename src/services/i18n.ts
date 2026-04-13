/* eslint-disable import/no-named-as-default-member */
import en from "@constants/translations/en.json";
import id from "@constants/translations/id.json";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: en },
  id: { translation: id }
};

export type SupportedLanguage = "id" | "en";

/**
 * Normalize locale code to supported language.
 * Handles Android returning "in" for Indonesian instead of "id".
 */
export function normalizeLanguage(
  code: string | null | undefined
): SupportedLanguage {
  if (code === "id" || code === "in") return "id";
  if (code === "en") return "en";
  return "id";
}

const getDeviceLanguage = (): SupportedLanguage => {
  const locales = getLocales();
  return normalizeLanguage(locales[0]?.languageCode);
};

export function initI18n() {
  i18n.use(initReactI18next).init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: "id",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
