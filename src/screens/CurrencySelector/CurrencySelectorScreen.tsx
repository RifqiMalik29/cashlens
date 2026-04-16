import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import { useCurrencySelectorScreen } from "./useCurrencySelectorScreen";

export default function CurrencySelectorScreen() {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    filteredCurrencies,
    currentCurrency,
    handleSelectCurrency
  } = useCurrencySelectorScreen();

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("currency.searchPlaceholder")}
            placeholderTextColor="#9CA3AF"
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
            className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3 mb-3"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-surface-secondary items-center justify-center mr-3">
              <Typography variant="h3">{currency.flag}</Typography>
            </View>
            <View className="flex-1">
              <Typography variant="body" weight="semibold">
                {currency.code}
              </Typography>
              <Typography variant="caption" color="#6B7280">
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
              color="#6B7280"
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
