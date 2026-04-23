import { useColors } from "@hooks/useColors";
import { useBudgetScreen } from "@screens/Budget/useBudgetScreen";
import { formatCompactCurrency } from "@utils/formatCurrency";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface BudgetSummaryProps {
  currency: string;
  onPressBudget?: () => void;
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "#EF4444";
  if (percentage >= 75) return "#F59E0B";
  return "#4CAF82";
}

export function BudgetSummary({ currency, onPressBudget }: BudgetSummaryProps) {
  const { t } = useTranslation();
  const { budgetsWithProgress } = useBudgetScreen();
  const colors = useColors();

  const hasBudgets = budgetsWithProgress.length > 0;
  if (!hasBudgets) return null;

  const periodLabels: Record<string, string> = {
    weekly: "/minggu",
    monthly: "/bulan",
    yearly: "/tahun"
  };

  return (
    <Card className="mb-4" style={{ shadowOpacity: 0.08 }}>
      <View className="flex-row items-center justify-between mb-3">
        <Typography
          variant="label"
          weight="medium"
          color={colors.textSecondary}
        >
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
        {budgetsWithProgress.slice(0, 3).map((budget) => {
          const progressColor = getProgressColor(budget.progress);

          return (
            <View key={budget.id}>
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.category.color }}
                  />
                  <Typography variant="body" weight="medium">
                    {budget.category.name}
                  </Typography>
                </View>
                <Typography
                  variant="caption"
                  weight="medium"
                  color={progressColor}
                >
                  {Math.round(budget.progress)}%
                </Typography>
              </View>

              <View
                className="h-2 rounded-full mb-1"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${budget.progress}%`,
                    backgroundColor: progressColor
                  }}
                />
              </View>

              <View className="flex-row justify-between">
                <Typography variant="caption" color={colors.textSecondary}>
                  {formatCompactCurrency(budget.spentAmount, currency)}{" "}
                  {periodLabels[budget.period] || "/bulan"}
                </Typography>
                <Typography
                  variant="caption"
                  color={budget.isExceeded ? "#EF4444" : colors.textSecondary}
                  weight={budget.isExceeded ? "medium" : "regular"}
                >
                  {budget.isExceeded
                    ? `Lewat ${formatCompactCurrency(
                        Math.abs(budget.remaining),
                        currency
                      )}`
                    : `Sisa ${formatCompactCurrency(
                        budget.remaining,
                        currency
                      )}`}
                </Typography>
              </View>
            </View>
          );
        })}

        {budgetsWithProgress.length > 3 && (
          <Typography
            variant="caption"
            color={colors.textSecondary}
            style={{ textAlign: "center" }}
          >
            +{budgetsWithProgress.length - 3} anggaran lainnya
          </Typography>
        )}
      </View>
    </Card>
  );
}
