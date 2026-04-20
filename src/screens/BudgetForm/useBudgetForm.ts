import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { budgetService } from "@services/budgetService";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { type Budget, type BudgetPeriod } from "@types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export function useBudgetForm() {
  const router = useProtectedRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const categories = useCategoryStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const existingBudget = id ? budgets.find((b) => b.id === id) : null;
  const isEditMode = !!existingBudget;

  // Store raw value without formatting
  const [rawAmount, setRawAmount] = useState(
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

  // Format amount for display only
  const displayAmount = useMemo(() => {
    if (!rawAmount) return "";
    const num = parseFloat(rawAmount);
    if (isNaN(num)) return rawAmount;
    return new Intl.NumberFormat("id-ID").format(num);
  }, [rawAmount]);

  // Handle formatted input - strip non-digits
  const handleAmountChange = useCallback((text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/[^0-9]/g, "");
    setRawAmount(cleaned);
  }, []);

  const handleSave = useCallback(async () => {
    setError(null);

    if (!rawAmount || parseFloat(rawAmount) <= 0) {
      setError("Jumlah anggaran harus diisi dan lebih dari 0");
      return;
    }

    if (!selectedCategoryId) {
      setError("Kategori harus dipilih");
      return;
    }

    if (isEditMode && !existingBudget?.id) {
      setError("Data anggaran tidak ditemukan");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate end date based on period
      const start = new Date(startDate);
      const end = new Date(start);
      if (period === "weekly") {
        end.setDate(start.getDate() + 6);
      } else if (period === "monthly") {
        end.setMonth(start.getMonth() + 1, 0);
      } else if (period === "yearly") {
        end.setFullYear(start.getFullYear() + 1, 0, 0);
      }

      const payload: Partial<Budget> = {
        categoryId: selectedCategoryId,
        amount: parseFloat(rawAmount),
        currency: baseCurrency,
        period,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      };

      if (isEditMode && existingBudget) {
        const saved = await budgetService.updateBudget(
          existingBudget.id,
          payload
        );
        updateBudget(existingBudget.id, {
          ...payload,
          id: saved.id,
          period: saved.period as BudgetPeriod,
          startDate: saved.start_date,
          endDate: saved.end_date
        });
      } else {
        const saved = await budgetService.createBudget(payload);
        addBudget({
          id: saved.id,
          categoryId: saved.category_id,
          amount: saved.amount,
          currency: baseCurrency,
          period: saved.period as BudgetPeriod,
          startDate: saved.start_date,
          endDate: saved.end_date
        });
      }

      router.back();
    } catch (err) {
      setError((err as Error).message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, [
    rawAmount,
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
      await budgetService.deleteBudget(id);
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
    displayAmount,
    handleAmountChange,
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
