import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type Budget } from "@/types";

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budgets: [],
      addBudget: (budget) =>
        set((state) => ({ budgets: [...state.budgets, budget] })),
      updateBudget: (id, data) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data } : b
          )
        })),
      deleteBudget: (id) =>
        set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }))
    }),
    {
      name: "budget-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
