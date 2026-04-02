import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { type TransactionType } from "@/types";

const DEFAULT_AMOUNT = "";
const DEFAULT_NOTE = "";

export function useTransactionForm() {
  const router = useRouter();
  const {
    id,
    amount: scannedAmount,
    categoryId: scannedCategoryId,
    date: scannedDate,
    note: scannedNote,
    receiptImageUri,
    isFromScan
  } = useLocalSearchParams<{
    id?: string;
    amount?: string;
    categoryId?: string;
    date?: string;
    note?: string;
    receiptImageUri?: string;
    isFromScan?: string;
  }>();

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
  const isScanTransaction = isFromScan === "true";

  const isEditMode = !!existingTransaction;

  const [amount, setAmount] = useState(
    existingTransaction
      ? existingTransaction.amount.toString()
      : scannedAmount || DEFAULT_AMOUNT
  );
  const [type, setType] = useState<TransactionType>(
    existingTransaction ? existingTransaction.type : "expense"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    existingTransaction
      ? existingTransaction.categoryId
      : scannedCategoryId || null
  );
  const [date, setDate] = useState(
    existingTransaction
      ? existingTransaction.date
      : scannedDate ||
          new Date().toISOString().split("T")[0] +
            "T" +
            new Date().toTimeString().split(" ")[0].slice(0, 5)
  );
  const [note, setNote] = useState(
    existingTransaction ? existingTransaction.note : scannedNote || DEFAULT_NOTE
  );
  const [receiptUri, setReceiptUri] = useState<string | undefined>(
    receiptImageUri || existingTransaction?.receiptImageUri
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scannedAmount && !existingTransaction) {
      setAmount(scannedAmount);
    }
    if (scannedDate && !existingTransaction) {
      setDate(scannedDate);
    }
    if (scannedNote && !existingTransaction) {
      setNote(scannedNote);
    }
    if (receiptImageUri && !existingTransaction) {
      setReceiptUri(receiptImageUri);
    }
    if (scannedCategoryId && !existingTransaction) {
      setSelectedCategoryId(scannedCategoryId);
    }
  }, [
    scannedAmount,
    scannedDate,
    scannedNote,
    receiptImageUri,
    scannedCategoryId,
    existingTransaction
  ]);

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
        receiptImageUri: receiptUri,
        isFromScan:
          isScanTransaction || existingTransaction?.isFromScan || false,
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
    isScanTransaction,
    categories,
    baseCurrency,
    handleSave,
    handleDelete
  };
}
