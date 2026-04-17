import { currencies } from "@constants/currencies";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useAuthStore } from "@stores/useAuthStore";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";

export function useCurrencySelectorScreen() {
  const router = useProtectedRouter();
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

  const handleSelectCurrency = useCallback(
    async (code: string) => {
      await Haptics.selectionAsync();
      updatePreferences({ baseCurrency: code });
      router.back();
    },
    [updatePreferences, router]
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredCurrencies,
    currentCurrency: preferences.baseCurrency,
    handleSelectCurrency
  };
}
