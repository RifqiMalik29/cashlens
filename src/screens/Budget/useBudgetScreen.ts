import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type Budget, type Category } from "@types";
import { useMemo } from "react";

interface BudgetWithProgress extends Budget {
  category: Category;
  spentAmount: number;
  progress: number;
  remaining: number;
  isExceeded: boolean;
}

function getBudgetPeriodDates(budget: Budget) {
  const now = new Date();
  let startDate = new Date(budget.startDate);

  let endDate: Date;
  let periodLabel: string;

  switch (budget.period) {
    case "weekly": {
      const dayOfWeek = startDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(startDate);
      monday.setDate(startDate.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      endDate = sunday;
      periodLabel = "Mingguan";
      break;
    }
    case "monthly": {
      const firstDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
      const lastDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
      lastDay.setHours(23, 59, 59, 999);

      startDate = firstDay;
      endDate = lastDay;
      periodLabel = "Bulanan";
      break;
    }
    case "yearly": {
      const firstDay = new Date(startDate.getFullYear(), 0, 1);
      const lastDay = new Date(startDate.getFullYear(), 11, 31);
      lastDay.setHours(23, 59, 59, 999);

      startDate = firstDay;
      endDate = lastDay;
      periodLabel = "Tahunan";
      break;
    }
    default:
      endDate = now;
      periodLabel = "Custom";
  }

  return { startDate, endDate, periodLabel };
}

export function useBudgetScreen() {
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

  return {
    budgetsWithProgress,
    activeBudgets,
    exceededBudgets,
    totalBudget,
    totalSpent,
    baseCurrency,
    hasBudgets: budgets.length > 0
  };
}
