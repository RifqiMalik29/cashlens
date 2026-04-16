import { useBudgetStore } from "@stores/useBudgetStore";
import { type Category, type Transaction } from "@types";
import { formatCompactCurrency } from "@utils/formatCurrency";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface BudgetSummaryProps {
  currency: string;
  onPressBudget?: () => void;
  transactions: Transaction[];
  categories: Category[];
}

function getPeriodDateRange(period: string) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "weekly": {
      const day = now.getDay(); // 0 is Sunday, 4 is Thursday (today)
      // If today is Thursday (4), diff = 16 - 4 + 1 = 13 (Monday)
      // If today is Sunday (0), diff = 16 - 0 + (-6) = 10 (Monday)
      const diff = now.getDate() - (day === 0 ? 6 : day - 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "monthly":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "yearly":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "#EF4444";
  if (percentage >= 75) return "#F59E0B";
  return "#4CAF82";
}

export function BudgetSummary({
  currency,
  onPressBudget,
  transactions,
  categories
}: BudgetSummaryProps) {
  const { t } = useTranslation();
  const budgets = useBudgetStore((state) => state.budgets);

  const budgetData = useMemo(() => {
    return budgets.map((budget) => {
      const category = categories.find((c) => c.id === budget.categoryId);
      const { start, end } = getPeriodDateRange(budget.period);

      const spent = transactions
        .filter((t) => {
          const transDate = new Date(t.date);
          return (
            t.type === "expense" &&
            t.categoryId === budget.categoryId &&
            transDate >= start &&
            transDate <= end
          );
        })
        .reduce((sum, t) => sum + t.amountInBaseCurrency, 0);

      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const remaining = budget.amount - spent;

      return {
        id: budget.id,
        categoryName: category?.name || "Lainnya",
        color: category?.color || "#9CA3AF",
        amount: budget.amount,
        period: budget.period,
        spent,
        percentage: Math.min(percentage, 100),
        remaining,
        isOverBudget: spent > budget.amount
      };
    });
  }, [budgets, categories, transactions]);

  const hasBudgets = budgetData.length > 0;
  if (!hasBudgets) return null;

  const periodLabels: Record<string, string> = {
    weekly: "/minggu",
    monthly: "/bulan",
    yearly: "/tahun"
  };

  return (
    <Card className="mb-4" style={{ shadowOpacity: 0.08 }}>
      <View className="flex-row items-center justify-between mb-3">
        <Typography variant="label" weight="medium" color="#6B7280">
          {t("budget.activeBudgets")}
        </Typography>
        {onPressBudget && (
          <TouchableOpacity onPress={onPressBudget} activeOpacity={0.7}>
            <Typography variant="caption" color="#4CAF82" weight="medium">
              {t("common.edit")}
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      <View className="gap-4">
        {budgetData.slice(0, 3).map((budget) => {
          const progressColor = getProgressColor(budget.percentage);

          return (
            <View key={budget.id}>
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.color }}
                  />
                  <Typography variant="body" weight="medium">
                    {budget.categoryName}
                  </Typography>
                </View>
                <Typography
                  variant="caption"
                  weight="medium"
                  color={progressColor}
                >
                  {Math.round(budget.percentage)}%
                </Typography>
              </View>

              <View className="h-2 rounded-full bg-gray-200 mb-1">
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${budget.percentage}%`,
                    backgroundColor: progressColor
                  }}
                />
              </View>

              <View className="flex-row justify-between">
                <Typography variant="caption" color="#6B7280">
                  {formatCompactCurrency(budget.spent, currency)}{" "}
                  {periodLabels[budget.period] || "/bulan"}
                </Typography>
                <Typography
                  variant="caption"
                  color={budget.isOverBudget ? "#EF4444" : "#6B7280"}
                  weight={budget.isOverBudget ? "medium" : "regular"}
                >
                  {budget.isOverBudget
                    ? `Lewat ${formatCompactCurrency(Math.abs(budget.remaining), currency)}`
                    : `Sisa ${formatCompactCurrency(budget.remaining, currency)}`}
                </Typography>
              </View>
            </View>
          );
        })}

        {budgetData.length > 3 && (
          <Typography
            variant="caption"
            color="#6B7280"
            style={{ textAlign: "center" }}
          >
            +{budgetData.length - 3} anggaran lainnya
          </Typography>
        )}
      </View>
    </Card>
  );
}
