import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useQuota } from "@hooks/useQuota";
import { type TransactionType } from "@types";
import { useTranslation } from "react-i18next";

import { handleDelete, handleSave, handleTypeChange } from "./handlers";
import { useTransactionFormState } from "./useTransactionFormState";

export function useTransactionForm() {
  const router = useProtectedRouter();
  const { t } = useTranslation();
  const { canAddTransaction } = useQuota();
  const s = useTransactionFormState();

  const resetForm = () => {
    s.setAmount("");
    s.setType("expense");
    s.setSelectedCategoryId(null);
    s.setDate(new Date().toISOString());
    s.setNote("");
    s.setReceiptUri(undefined);
    s.setError(null);
  };

  const executeSave = async () => {
    await handleSave({
      setAmount: s.setAmount,
      setType: s.setType,
      setSelectedCategoryId: s.setSelectedCategoryId,
      setDate: s.setDate,
      setNote: s.setNote,
      setReceiptUri: s.setReceiptUri,
      setError: s.setError,
      setIsLoading: s.setIsLoading,
      amount: s.amount,
      type: s.type,
      selectedCategoryId: s.selectedCategoryId,
      date: s.date,
      note: s.note,
      receiptUri: s.receiptUri,
      isEditMode: s.isEditMode,
      isScanTransaction: s.isScanTransaction,
      canAddTransaction,
      baseCurrency: s.baseCurrency,
      draftId: s.draftId,
      existingTransaction: s.existingTransaction,
      addTransaction: s.addTransaction,
      updateTransaction: s.updateTransaction,
      confirmDraft: s.confirmDraft,
      resetForm,
      routerBack: () => router.back(),
      errorMessages: {
        transactionLimit: t("form.transactionLimitError"),
        amountRequired: t("form.amountRequired"),
        genericError: t("form.genericError")
      }
    });
  };

  const onSave = async () => {
    if (!s.isEditMode && !canAddTransaction) {
      s.setShowPaywall(true);
      return;
    }
    if (!s.selectedCategoryId) {
      s.setShowUncategorizedDialog(true);
      return;
    }
    await executeSave();
  };

  const onDelete = async () => {
    await handleDelete({
      id: s.id,
      existingTransaction: s.existingTransaction,
      deleteTransaction: s.deleteTransaction,
      setError: s.setError,
      setIsLoading: s.setIsLoading,
      routerBack: () => router.back()
    });
  };

  const handleTypeChangeFn = (newType: TransactionType) => {
    s.setType(newType);
    handleTypeChange({
      newType,
      categories: s.categories,
      selectedCategoryId: s.selectedCategoryId,
      setSelectedCategoryId: s.setSelectedCategoryId
    });
  };

  return {
    amount: s.amount,
    setAmount: s.setAmount,
    type: s.type,
    handleTypeChange: handleTypeChangeFn,
    selectedCategoryId: s.selectedCategoryId,
    setSelectedCategoryId: s.setSelectedCategoryId,
    date: s.date,
    setDate: s.setDate,
    note: s.note,
    setNote: s.setNote,
    isLoading: s.isLoading,
    error: s.error,
    isEditMode: s.isEditMode,
    isScanTransaction: s.isScanTransaction,
    categories: s.categories,
    baseCurrency: s.baseCurrency,
    handleSave: onSave,
    handleDelete: onDelete,
    showPaywall: s.showPaywall,
    setShowPaywall: s.setShowPaywall,
    showUncategorizedDialog: s.showUncategorizedDialog,
    setShowUncategorizedDialog: s.setShowUncategorizedDialog,
    handleConfirmUncategorized: executeSave
  };
}
