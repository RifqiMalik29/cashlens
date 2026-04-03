/* eslint-disable import/no-named-as-default-member */
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/constants/translations/en.json";
import id from "@/constants/translations/id.json";

const resources = {
  en: { translation: en },
  id: { translation: id }
};

const getDeviceLanguage = (): string => {
  const locales = getLocales();
  const deviceLang = locales[0]?.languageCode || "id";
  return deviceLang === "id" ? "id" : "en";
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
