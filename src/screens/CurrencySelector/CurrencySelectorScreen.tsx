import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import { useCurrencySelectorScreen } from "./useCurrencySelectorScreen";

export default function CurrencySelectorScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const {
    searchQuery,
    setSearchQuery,
    filteredCurrencies,
    currentCurrency,
    handleSelectCurrency
  } = useCurrencySelectorScreen();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-6 pt-4 pb-4">
        <View
          className="flex-row items-center border border-border rounded-lg px-4 py-3"
          style={{ backgroundColor: colors.surface }}
        >
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            className="flex-1 ml-3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("currency.searchPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            style={{ color: colors.textPrimary }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {filteredCurrencies.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            onPress={() => handleSelectCurrency(currency.code)}
            className="flex-row items-center border border-border rounded-lg px-4 py-3 mb-3"
            style={{ backgroundColor: colors.surface }}
            activeOpacity={0.7}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.surfaceSecondary }}
            >
              <Typography variant="h3">{currency.flag}</Typography>
            </View>
            <View className="flex-1">
              <Typography variant="body" weight="semibold">
                {currency.code}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {currency.name}
              </Typography>
            </View>
            <View className="items-end">
              <Typography variant="body" weight="medium" color="#4CAF82">
                {currency.symbol}
              </Typography>
              {currentCurrency === currency.code && (
                <View className="w-2 h-2 rounded-full bg-primary mt-1" />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filteredCurrencies.length === 0 && (
          <View className="items-center justify-center py-12">
            <Typography
              variant="body"
              color={colors.textSecondary}
              style={{ textAlign: "center" }}
            >
              {t("currency.noResults")}
            </Typography>
          </View>
        )}

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </View>
  );
}
