import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type Budget } from "@/types";

interface BudgetState {
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  clearBudgets: () => void;
  setBudgets: (budgets: Budget[]) => void;
  _syncVersion: number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],
      _syncVersion: 0,
      addBudget: (budget) => {
        set((state) => ({
          budgets: [...state.budgets, budget],
          _syncVersion: state._syncVersion + 1
        }));
      },
      updateBudget: (id, data) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
          _syncVersion: state._syncVersion + 1
        }));
      },
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
          _syncVersion: state._syncVersion + 1
        }));
      },
      clearBudgets: () => {
        set({ budgets: [], _syncVersion: 0 });
      },
      setBudgets: (budgets) => {
        set({ budgets, _syncVersion: get()._syncVersion + 1 });
      }
    }),
    {
      name: "budget-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
