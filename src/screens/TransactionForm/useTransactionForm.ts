import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type TransactionType } from "@types";
import { generateId } from "@utils/generateId";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const DEFAULT_AMOUNT = "";

export function useTransactionForm() {
  const router = useRouter();
  const {
    id,
    amount: scannedAmount,
    categoryId: scannedCategoryId,
    date: scannedDate,
    note: scannedNote,
    receiptImageUri,
    isFromScan,
    draftId
  } = useLocalSearchParams<{
    id?: string;
    amount?: string;
    categoryId?: string;
    date?: string;
    note?: string;
    receiptImageUri?: string;
    isFromScan?: string;
    draftId?: string;
  }>();

  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const categories = useCategoryStore((state) => state.categories);
  const transactions = useTransactionStore((state) => state.transactions);
  const drafts = useDraftStore((state) => state.drafts);
  const confirmDraft = useDraftStore((state) => state.confirmDraft);

  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  );
  const deleteTransaction = useTransactionStore(
    (state) => state.deleteTransaction
  );

  const existingTransaction = id ? transactions.find((t) => t.id === id) : null;
  const existingDraft = draftId ? drafts.find((d) => d.id === draftId) : null;

  const isScanTransaction = isFromScan === "true";
  const isEditMode = !!existingTransaction;

  const [amount, setAmount] = useState(
    existingTransaction
      ? existingTransaction.amount.toString()
      : existingDraft
        ? existingDraft.amount.toString()
        : scannedAmount || DEFAULT_AMOUNT
  );
  const [type, setType] = useState<TransactionType>(
    existingTransaction
      ? existingTransaction.type
      : existingDraft
        ? existingDraft.type
        : "expense"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    existingTransaction ? existingTransaction.categoryId : null
  );
  const [date, setDate] = useState(
    existingTransaction
      ? existingTransaction.date
      : existingDraft
        ? existingDraft.date
        : scannedDate || new Date().toISOString()
  );
  const [note, setNote] = useState(
    existingTransaction
      ? existingTransaction.note
      : existingDraft
        ? existingDraft.description
        : ""
  );
  const [receiptUri, setReceiptUri] = useState<string | undefined>(
    receiptImageUri || existingTransaction?.receiptImageUri
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scannedAmount && !existingTransaction && !existingDraft) {
      setAmount(scannedAmount);
    }
    if (scannedDate && !existingTransaction && !existingDraft) {
      setDate(scannedDate);
    }
    if (scannedNote && !existingTransaction && !existingDraft) {
      setNote(scannedNote);
    }
    if (receiptImageUri && !existingTransaction && !existingDraft) {
      setReceiptUri(receiptImageUri);
    }
    if (scannedCategoryId && !existingTransaction && !existingDraft) {
      setSelectedCategoryId(scannedCategoryId);
    }
  }, [
    scannedAmount,
    scannedDate,
    scannedNote,
    receiptImageUri,
    scannedCategoryId,
    existingTransaction,
    existingDraft
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
        id: existingTransaction?.id ?? generateId(),
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
        // If it was a draft, confirm it
        if (draftId) {
          confirmDraft(draftId);
        }
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
