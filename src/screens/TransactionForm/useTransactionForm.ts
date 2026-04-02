import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { type TransactionType } from "@/types";

const DEFAULT_AMOUNT = "";
const DEFAULT_NOTE = "";

export function useTransactionForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const categories = useCategoryStore((state) => state.categories);
  const transactions = useTransactionStore((state) => state.transactions);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  );
  const deleteTransaction = useTransactionStore(
    (state) => state.deleteTransaction
  );

  const existingTransaction = id ? transactions.find((t) => t.id === id) : null;

  const isEditMode = !!existingTransaction;

  const [amount, setAmount] = useState(
    existingTransaction ? existingTransaction.amount.toString() : DEFAULT_AMOUNT
  );
  const [type, setType] = useState<TransactionType>(
    existingTransaction ? existingTransaction.type : "expense"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    existingTransaction ? existingTransaction.categoryId : null
  );
  const [date, setDate] = useState(
    existingTransaction
      ? existingTransaction.date
      : new Date().toISOString().split("T")[0] +
          "T" +
          new Date().toTimeString().split(" ")[0].slice(0, 5)
  );
  const [note, setNote] = useState(
    existingTransaction ? existingTransaction.note : DEFAULT_NOTE
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Jumlah harus diisi dan lebih dari 0");
      return;
    }

    if (!selectedCategoryId) {
      setError("Kategori harus dipilih");
      return;
    }

    setIsLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      const transactionData = {
        id: existingTransaction?.id ?? `txn_${Date.now()}`,
        amount: numericAmount,
        currency: baseCurrency,
        amountInBaseCurrency: numericAmount,
        exchangeRate: 1,
        type,
        categoryId: selectedCategoryId,
        note: note.trim(),
        date,
        isFromScan: false,
        createdAt: existingTransaction?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditMode) {
        updateTransaction(transactionData.id, transactionData);
      } else {
        addTransaction(transactionData);
      }

      router.back();
    } catch (err) {
      setError((err as Error).message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !existingTransaction) return;

    setIsLoading(true);

    try {
      deleteTransaction(id);
      router.back();
    } catch (err) {
      setError((err as Error).message || "Gagal menghapus transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const filteredCategories = categories.filter(
      (cat) => cat.type === "both" || cat.type === newType
    );
    if (
      selectedCategoryId &&
      !filteredCategories.some((c) => c.id === selectedCategoryId)
    ) {
      setSelectedCategoryId(null);
    }
  };

  return {
    amount,
    setAmount,
    type,
    handleTypeChange,
    selectedCategoryId,
    setSelectedCategoryId,
    date,
    setDate,
    note,
    setNote,
    isLoading,
    error,
    isEditMode,
    categories,
    baseCurrency,
    handleSave,
    handleDelete
  };
}
