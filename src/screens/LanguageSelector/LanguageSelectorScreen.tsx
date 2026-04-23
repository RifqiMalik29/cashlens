import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguageSelector } from "./useLanguageSelector";

export default function LanguageSelectorScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { languages, currentLanguage, handleSelectLanguage } =
    useLanguageSelector();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="gap-3">
          {languages.map((lang) => {
            const isSelected = lang.code === currentLanguage;

            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelectLanguage(lang.code)}
                className={`flex-row items-center border rounded-xl px-4 py-4 ${
                  isSelected
                    ? "border-primary bg-primary-light"
                    : "border-border"
                }`}
                style={
                  !isSelected ? { backgroundColor: colors.surface } : undefined
                }
                activeOpacity={0.7}
              >
                <View className="mr-4">
                  <Typography variant="h4">{lang.flag}</Typography>
                </View>

                <View className="flex-1">
                  <Typography
                    variant="body"
                    weight={isSelected ? "semibold" : "medium"}
                    color={isSelected ? colors.primary : colors.textPrimary}
                  >
                    {lang.nativeName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={isSelected ? colors.primary : colors.textSecondary}
                  >
                    {lang.name}
                  </Typography>
                </View>

                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          className="mt-6 p-4 rounded-xl"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <Typography variant="caption" color={colors.textSecondary}>
            {t("language.changeInfo")}
          </Typography>
        </View>

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}
