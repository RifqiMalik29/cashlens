import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type Budget, type Category } from "@types";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

interface BudgetWithProgress extends Budget {
  category: Category;
  spentAmount: number;
  progress: number;
  remaining: number;
  isExceeded: boolean;
}

function getBudgetPeriodDates(budget: Budget) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate: Date;
  let endDate: Date;
  let periodLabel: string;

  switch (budget.period) {
    case "weekly": {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      startDate = new Date(todayStart);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = "Mingguan";
      break;
    }
    case "monthly": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = "Bulanan";
      break;
    }
    case "yearly": {
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = "Tahunan";
      break;
    }
    default:
      startDate = new Date(budget.startDate);
      endDate = now;
      periodLabel = "Custom";
  }

  return { startDate, endDate, periodLabel };
}

export function useBudgetScreen() {
  const router = useRouter();
  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const budgets = useBudgetStore((state) => state.budgets);
  const categories = useCategoryStore((state) => state.categories);
  const transactions = useTransactionStore((state) => state.transactions);

  const budgetsWithProgress = useMemo<BudgetWithProgress[]>(() => {
    return budgets.map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      const { startDate, endDate } = getBudgetPeriodDates(budget);

      const spentAmount = transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            t.type === "expense" &&
            t.categoryId === budget.categoryId &&
            transactionDate >= startDate &&
            transactionDate <= endDate
          );
        })
        .reduce((sum, t) => sum + t.amountInBaseCurrency, 0);

      const progress =
        budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
      const remaining = budget.amount - spentAmount;
      const isExceeded = remaining < 0;

      return {
        ...budget,
        category: category || {
          id: "unknown",
          name: "Tidak Diketahui",
          icon: "MoreHorizontal",
          color: "#9CA3AF",
          isDefault: false,
          isCustom: false,
          type: "expense" as const
        },
        spentAmount,
        progress,
        remaining,
        isExceeded
      };
    });
  }, [budgets, categories, transactions]);

  const activeBudgets = useMemo(() => {
    return budgetsWithProgress.filter((b) => !b.isExceeded);
  }, [budgetsWithProgress]);

  const exceededBudgets = useMemo(() => {
    return budgetsWithProgress.filter((b) => b.isExceeded);
  }, [budgetsWithProgress]);

  const totalBudget = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.amount, 0);
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgetsWithProgress.reduce((sum, b) => sum + b.spentAmount, 0);
  }, [budgetsWithProgress]);

  const handleAddBudget = useCallback(() => {
    router.push("/(forms)/budget-add");
  }, [router]);

  const handleEditBudget = useCallback(
    (budgetId: string) => {
      router.push(`/(forms)/budget-edit?id=${budgetId}`);
    },
    [router]
  );

  return {
    budgetsWithProgress,
    activeBudgets,
    exceededBudgets,
    totalBudget,
    totalSpent,
    baseCurrency,
    hasBudgets: budgets.length > 0,
    handleAddBudget,
    handleEditBudget
  };
}
