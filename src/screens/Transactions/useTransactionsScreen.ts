import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useMemo, useState } from "react";

export function useTransactionsScreen() {
  const router = useProtectedRouter();
  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);

  const hasTransactions = useMemo(
    () => transactions.length > 0,
    [transactions]
  );

  const [showNoCategoryDialog, setShowNoCategoryDialog] = useState(false);

  const handleAddTransaction = () => {
    if (categories.length === 0) {
      setShowNoCategoryDialog(true);
      return;
    }
    router.push("/(tabs)/transactions/add");
  };

  const handleGoToCategories = () => {
    setShowNoCategoryDialog(false);
    router.push("/(tabs)/settings/categories");
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
    handleAddTransaction,
    showNoCategoryDialog,
    setShowNoCategoryDialog,
    handleGoToCategories
  };
}
