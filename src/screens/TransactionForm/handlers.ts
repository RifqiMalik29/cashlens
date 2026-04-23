import { transactionService } from "@services/transactionService";
import type { Transaction, TransactionType } from "@types";
import type { Dispatch, SetStateAction } from "react";

interface Category {
  id: string;
  type: string;
}

export function handleTypeChange(params: {
  newType: TransactionType;
  categories: Category[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
}) {
  const { newType, categories, selectedCategoryId, setSelectedCategoryId } =
    params;
  const filtered = categories.filter(
    (cat) => cat.type === "both" || cat.type === newType
  );
  if (
    selectedCategoryId &&
    !filtered.some((c) => c.id === selectedCategoryId)
  ) {
    setSelectedCategoryId(null);
  }
}

interface SaveDeps {
  setAmount: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<"income" | "expense">>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
  setDate: Dispatch<SetStateAction<string>>;
  setNote: Dispatch<SetStateAction<string>>;
  setReceiptUri: Dispatch<SetStateAction<string | undefined>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  amount: string;
  type: "income" | "expense";
  selectedCategoryId: string | null;
  date: string;
  note: string;
  receiptUri: string | undefined;
  isEditMode: boolean;
  isScanTransaction: boolean;
  canAddTransaction: boolean;
  baseCurrency: string;
  draftId?: string;
  existingTransaction: Transaction | null | undefined;
  addTransaction: (data: Transaction) => void;
  updateTransaction: (id: string, data: Transaction) => void;
  confirmDraft: (id: string) => void;
  resetForm: () => void;
  routerBack: () => void;
}

export async function handleSave(d: SaveDeps) {
  const {
    setError,
    setIsLoading,
    amount,
    selectedCategoryId,
    isEditMode,
    canAddTransaction,
    type,
    date,
    note,
    receiptUri,
    isScanTransaction,
    baseCurrency,
    existingTransaction,
    draftId,
    addTransaction,
    updateTransaction,
    confirmDraft,
    routerBack,
    resetForm
  } = d;

  setError(null);
  if (!isEditMode && !canAddTransaction) {
    setError("Limit transaksi gratis tercapai (50/bulan). Silakan upgrade.");
    return;
  }
  if (!amount || parseFloat(amount) <= 0) {
    setError("Jumlah harus diisi dan lebih dari 0");
    return;
  }
  if (!selectedCategoryId) {
    setError("Kategori harus dipilih");
    return;
  }

  setIsLoading(true);
  let navigated = false;
  try {
    const numericAmount = parseFloat(amount);

    if (isEditMode && existingTransaction) {
      const saved = await transactionService.updateTransaction(
        existingTransaction.id,
        {
          categoryId: selectedCategoryId,
          amount: numericAmount,
          note: note.trim(),
          date
        }
      );
      updateTransaction(existingTransaction.id, {
        id: existingTransaction.id,
        amount: numericAmount,
        currency: baseCurrency,
        amountInBaseCurrency: numericAmount,
        exchangeRate: 1,
        type,
        categoryId: selectedCategoryId,
        note: note.trim(),
        date: saved.transaction_date ?? saved.date ?? date,
        receiptImageUri: receiptUri,
        isFromScan: isScanTransaction || !!existingTransaction.isFromScan,
        createdAt: existingTransaction.createdAt,
        updatedAt: saved.updated_at
      });
    } else {
      const saved = await transactionService.createTransaction({
        categoryId: selectedCategoryId,
        amount: numericAmount,
        type,
        note: note.trim(),
        date
      });
      addTransaction({
        id: saved.id,
        amount: numericAmount,
        currency: baseCurrency,
        amountInBaseCurrency: numericAmount,
        exchangeRate: 1,
        type,
        categoryId: selectedCategoryId,
        note: note.trim(),
        date: saved.transaction_date ?? saved.date ?? date,
        receiptImageUri: receiptUri,
        isFromScan: isScanTransaction,
        createdAt: saved.created_at,
        updatedAt: saved.updated_at
      });
      if (draftId) confirmDraft(draftId);
      resetForm();
    }
    navigated = true;
    routerBack();
  } catch (err) {
    setError((err as Error).message || "Terjadi kesalahan");
  } finally {
    if (!navigated) setIsLoading(false);
  }
}

interface DeleteDeps {
  id?: string;
  existingTransaction: Transaction | null | undefined;
  deleteTransaction: (id: string) => void;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  routerBack: () => void;
}

export async function handleDelete(d: DeleteDeps) {
  const {
    id,
    existingTransaction,
    deleteTransaction,
    setError,
    setIsLoading,
    routerBack
  } = d;
  if (!id || !existingTransaction) return;
  setIsLoading(true);
  let navigated = false;
  try {
    await transactionService.deleteTransaction(id);
    deleteTransaction(id);
    navigated = true;
    routerBack();
  } catch (err) {
    setError((err as Error).message || "Gagal menghapus transaksi");
  } finally {
    if (!navigated) setIsLoading(false);
  }
}
