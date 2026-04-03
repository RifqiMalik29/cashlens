import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export function useTransactionsScreen() {
  const router = useRouter();
  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);

  const hasTransactions = useMemo(
    () => transactions.length > 0,
    [transactions]
  );

  const handleAddTransaction = () => {
    router.push("/(tabs)/transactions/add");
  };

  const handleTransactionPress = (transaction: (typeof transactions)[0]) => {
    router.push(`/(tabs)/transactions/edit?id=${transaction.id}`);
  };

  return {
    transactions,
    categories,
    baseCurrency,
    hasTransactions,
    handleTransactionPress,
    handleAddTransaction
  };
}
