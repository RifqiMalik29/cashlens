import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Transaction } from "@types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  setTransactions: (transactions: Transaction[]) => void;
  _syncVersion: number;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      _syncVersion: 0,
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          _syncVersion: state._syncVersion + 1
        }));
      },
      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? { ...t, ...data, updatedAt: new Date().toISOString() }
              : t
          ),
          _syncVersion: state._syncVersion + 1
        }));
      },
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          _syncVersion: state._syncVersion + 1
        }));
      },
      clearTransactions: () => {
        set({ transactions: [], _syncVersion: 0 });
      },
      setTransactions: (transactions) => {
        set({ transactions, _syncVersion: get()._syncVersion + 1 });
      }
    }),
    {
      name: "transaction-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
