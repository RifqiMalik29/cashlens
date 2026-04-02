import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { type BudgetPeriod } from "@/types";

export function useBudgetForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const categories = useCategoryStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const existingBudget = id ? budgets.find((b) => b.id === id) : null;
  const isEditMode = !!existingBudget;

  const [amount, setAmount] = useState(
    existingBudget ? existingBudget.amount.toString() : ""
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    existingBudget ? existingBudget.categoryId : ""
  );
  const [period, setPeriod] = useState<BudgetPeriod>(
    existingBudget ? existingBudget.period : "monthly"
  );
  const [startDate, setStartDate] = useState(
    existingBudget
      ? existingBudget.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = categories.filter(
    (cat) => cat.type === "expense" || cat.type === "both"
  );

  const handleSave = useCallback(async () => {
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Jumlah anggaran harus diisi dan lebih dari 0");
      return;
    }

    if (!selectedCategoryId) {
      setError("Kategori harus dipilih");
      return;
    }

    setIsLoading(true);

    try {
      const budgetData = {
        id: existingBudget?.id ?? `budget_${Date.now()}`,
        categoryId: selectedCategoryId,
        amount: parseFloat(amount),
        currency: baseCurrency,
        period,
        startDate: startDate + "T00:00:00",
        updatedAt: new Date().toISOString()
      };

      if (isEditMode) {
        updateBudget(budgetData.id, budgetData);
      } else {
        addBudget(budgetData);
      }

      router.back();
    } catch (err) {
      setError((err as Error).message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, [
    amount,
    selectedCategoryId,
    period,
    startDate,
    baseCurrency,
    existingBudget,
    isEditMode,
    addBudget,
    updateBudget,
    router
  ]);

  const handleDelete = useCallback(async () => {
    if (!id || !existingBudget) return;

    setIsLoading(true);

    try {
      deleteBudget(id);
      router.back();
    } catch (err) {
      setError((err as Error).message || "Gagal menghapus anggaran");
    } finally {
      setIsLoading(false);
    }
  }, [id, existingBudget, deleteBudget, router]);

  const handlePeriodChange = useCallback((newPeriod: BudgetPeriod) => {
    setPeriod(newPeriod);
  }, []);

  return {
    amount,
    setAmount,
    selectedCategoryId,
    setSelectedCategoryId,
    period,
    handlePeriodChange,
    startDate,
    setStartDate,
    isLoading,
    error,
    isEditMode,
    expenseCategories,
    baseCurrency,
    handleSave,
    handleDelete
  };
}
