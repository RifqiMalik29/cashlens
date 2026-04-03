import { Typography } from "@components/ui/Typography";
import { currencies } from "@constants/currencies";
import { spacing } from "@constants/theme";
import { useAuthStore } from "@stores/useAuthStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

export default function CurrencySelectorScreen() {
  const router = useRouter();
  const { preferences, updatePreferences } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return currencies;
    const query = searchQuery.toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCurrency = async (code: string) => {
    await Haptics.selectionAsync();
    updatePreferences({ baseCurrency: code });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari mata uang..."
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
              {preferences.baseCurrency === currency.code && (
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
              Tidak ada mata uang yang ditemukan
            </Typography>
          </View>
        )}

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </View>
  );
}
