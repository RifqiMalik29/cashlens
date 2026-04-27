import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useQuota } from "@hooks/useQuota";
import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type TransactionType } from "@types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { handleDelete, handleSave, handleTypeChange } from "./handlers";

const DEFAULT_AMOUNT = "";

export function useTransactionForm() {
  const router = useProtectedRouter();
  const { t } = useTranslation();
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

  const tx = existingTransaction;
  const draft = existingDraft;
  const [amount, setAmount] = useState(
    tx
      ? tx.amount.toString()
      : draft
        ? draft.amount.toString()
        : scannedAmount || DEFAULT_AMOUNT
  );
  const [type, setType] = useState<TransactionType>(
    tx ? tx.type : draft ? draft.type : "expense"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    tx ? tx.categoryId : null
  );
  const [date, setDate] = useState(
    tx ? tx.date : draft ? draft.date : scannedDate || new Date().toISOString()
  );
  const [note, setNote] = useState(
    tx ? tx.note : draft ? draft.description : ""
  );
  const [receiptUri, setReceiptUri] = useState<string | undefined>(
    receiptImageUri || tx?.receiptImageUri
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategoryId || isEditMode) return;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (cat && (cat.type === "income" || cat.type === "expense")) {
      setType(cat.type);
    }
  }, [selectedCategoryId, categories, isEditMode]);

  useEffect(() => {
    if (existingTransaction || existingDraft) return;
    if (scannedAmount) setAmount(scannedAmount);
    if (scannedDate) setDate(scannedDate);
    if (scannedNote) setNote(scannedNote);
    if (receiptImageUri) setReceiptUri(receiptImageUri);
    if (scannedCategoryId) setSelectedCategoryId(scannedCategoryId);
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

  const resetForm = () => {
    setAmount(DEFAULT_AMOUNT);
    setType("expense");
    setSelectedCategoryId(null);
    setDate(new Date().toISOString());
    setNote("");
    setReceiptUri(undefined);
    setError(null);
  };

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
      resetForm,
      routerBack: () => router.back(),
      errorMessages: {
        transactionLimit: t("form.transactionLimitError"),
        amountRequired: t("form.amountRequired"),
        categoryRequired: t("form.categoryRequired"),
        genericError: t("form.genericError")
      }
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
    setType(newType);
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
