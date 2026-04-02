import { useRouter } from "expo-router";

import { useHeader } from "@/hooks/useHeader";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";

export function useTransactionsScreen() {
  const router = useRouter();
  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);

  const handleAddTransaction = () => {
    router.push("/(tabs)/transactions/add");
  };

  const handleTransactionPress = (transaction: (typeof transactions)[0]) => {
    router.push(`/(tabs)/transactions/edit?id=${transaction.id}`);
  };

  useHeader({
    title: "Transaksi"
  });

  return {
    transactions,
    categories,
    baseCurrency,
    handleTransactionPress,
    handleAddTransaction
  };
}
