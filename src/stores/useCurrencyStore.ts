import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { currencies } from "@/constants/currencies";
import { type Currency } from "@/types";

interface CurrencyState {
  availableCurrencies: Currency[];
  baseCurrency: string;
  rates: Record<string, number>;
  lastUpdated: string | null;
  setBaseCurrency: (code: string) => void;
  setRates: (rates: Record<string, number>) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      availableCurrencies: currencies,
      baseCurrency: "IDR",
      rates: {},
      lastUpdated: null,
      setBaseCurrency: (code) => set({ baseCurrency: code }),
      setRates: (rates) => set({ rates, lastUpdated: new Date().toISOString() })
    }),
    {
      name: "currency-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
