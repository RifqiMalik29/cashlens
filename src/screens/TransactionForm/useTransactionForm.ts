import { useQuota } from "@hooks/useQuota";
import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type TransactionType } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { handleDelete, handleSave, handleTypeChange } from "./handlers";

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

  const { canAddTransaction } = useQuota();

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

  const [showPaywall, setShowPaywall] = useState(false);

  const onSave = async () => {
    if (!isEditMode && !canAddTransaction) {
      setShowPaywall(true);
      return;
    }
    await handleSave({
      setAmount,
      setType,
      setSelectedCategoryId,
      setDate,
      setNote,
      setReceiptUri,
      setError,
      setIsLoading,
      amount,
      type,
      selectedCategoryId,
      date,
      note,
      receiptUri,
      isEditMode,
      isScanTransaction,
      canAddTransaction,
      baseCurrency,
      draftId,
      existingTransaction,
      addTransaction,
      updateTransaction,
      confirmDraft,
      resetForm: () => {
        setAmount(DEFAULT_AMOUNT);
        setType("expense");
        setSelectedCategoryId(null);
        setDate(new Date().toISOString());
        setNote("");
        setReceiptUri(undefined);
        setError(null);
      },
      routerBack: () => router.back()
    });
  };

  const onDelete = async () => {
    await handleDelete({
      id,
      existingTransaction,
      deleteTransaction,
      setError,
      setIsLoading,
      routerBack: () => router.back()
    });
  };

  const handleTypeChangeFn = (newType: TransactionType) => {
    handleTypeChange({
      newType,
      categories,
      selectedCategoryId,
      setSelectedCategoryId
    });
  };

  return {
    amount,
    setAmount,
    type,
    handleTypeChange: handleTypeChangeFn,
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
    handleSave: onSave,
    handleDelete: onDelete,
    showPaywall,
    setShowPaywall
  };
}
