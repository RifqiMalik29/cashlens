import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type TransactionType } from "@types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_AMOUNT = "";

export function useTransactionFormState() {
  const {
    id,
    amount: sa,
    categoryId: sc,
    date: sd,
    note: sn,
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

  const existingTransaction = id
    ? transactions.find((tx) => tx.id === id)
    : null;
  const existingDraft = draftId ? drafts.find((d) => d.id === draftId) : null;
  const isScanTransaction = isFromScan === "true";
  const isEditMode = !!existingTransaction;

  const [amount, setAmount] = useState(
    existingTransaction?.amount.toString() ||
      existingDraft?.amount.toString() ||
      sa ||
      DEFAULT_AMOUNT
  );
  const [type, setType] = useState<TransactionType>(
    existingTransaction?.type || existingDraft?.type || "expense"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    existingTransaction?.categoryId || null
  );
  const [date, setDate] = useState(
    existingTransaction?.date ||
      existingDraft?.date ||
      sd ||
      new Date().toISOString()
  );
  const [note, setNote] = useState(
    existingTransaction?.note || existingDraft?.description || ""
  );
  const [receiptUri, setReceiptUri] = useState<string | undefined>(
    receiptImageUri || existingTransaction?.receiptImageUri
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUncategorizedDialog, setShowUncategorizedDialog] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  useEffect(() => {
    if (!selectedCategoryId || isEditMode) return;
    const cat = categories.find((c) => c.id === selectedCategoryId);
    if (cat && (cat.type === "income" || cat.type === "expense"))
      setType(cat.type);
  }, [selectedCategoryId, categories, isEditMode]);

  useEffect(() => {
    if (existingTransaction || existingDraft) return;
    if (sa) setAmount(sa);
    if (sd) setDate(sd);
    if (sn) setNote(sn);
    if (receiptImageUri) setReceiptUri(receiptImageUri);
    if (sc) setSelectedCategoryId(sc);
  }, [sa, sd, sn, receiptImageUri, sc, existingTransaction, existingDraft]);

  return {
    id,
    draftId,
    baseCurrency,
    categories,
    confirmDraft,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    existingTransaction,
    existingDraft,
    isScanTransaction,
    isEditMode,
    amount,
    setAmount,
    type,
    setType,
    selectedCategoryId,
    setSelectedCategoryId,
    date,
    setDate,
    note,
    setNote,
    receiptUri,
    setReceiptUri,
    isLoading,
    setIsLoading,
    error,
    setError,
    showPaywall,
    setShowPaywall,
    showUncategorizedDialog,
    setShowUncategorizedDialog
  };
}
