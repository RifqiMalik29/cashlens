import type { Transaction, TransactionType } from "@types";
import { generateId } from "@utils/generateId";
import type { Dispatch, SetStateAction } from "react";

interface Category {
  id: string;
  type: string;
}

interface ResetFormParams {
  setAmount: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<"income" | "expense">>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
  setDate: Dispatch<SetStateAction<string>>;
  setNote: Dispatch<SetStateAction<string>>;
  setReceiptUri: Dispatch<SetStateAction<string | undefined>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function resetForm(params: ResetFormParams) {
  const {
    setAmount,
    setType,
    setSelectedCategoryId,
    setDate,
    setNote,
    setReceiptUri,
    setError
  } = params;
  setAmount("");
  setType("expense");
  setSelectedCategoryId(null);
  setDate(new Date().toISOString());
  setNote("");
  setReceiptUri(undefined);
  setError(null);
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
  try {
    const numericAmount = parseFloat(amount);
    const tx: Transaction = {
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
      isFromScan: isScanTransaction || !!existingTransaction?.isFromScan,
      createdAt: existingTransaction?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEditMode) {
      updateTransaction(tx.id, tx);
    } else {
      addTransaction(tx);
      if (draftId) confirmDraft(draftId);
      resetForm();
    }
    routerBack();
  } catch (err) {
    setError((err as Error).message || "Terjadi kesalahan");
  } finally {
    setIsLoading(false);
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
  try {
    deleteTransaction(id);
    routerBack();
  } catch (err) {
    setError((err as Error).message || "Gagal menghapus transaksi");
  } finally {
    setIsLoading(false);
  }
}
