import { useTranslation } from "react-i18next";

export function useCategoryName() {
  const { t } = useTranslation();

  return (name: string, nameKey: string | null): string => {
    if (!nameKey) return name;
    return t(`categories.names.${nameKey}`, { defaultValue: name });
  };
}
