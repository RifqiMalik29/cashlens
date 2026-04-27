import { BudgetCard } from "@components/budget/BudgetCard";
import { EmptyState } from "@components/transaction/EmptyState";
import { Card } from "@components/ui/Card";
import { FAB } from "@components/ui/FAB";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { formatCurrency } from "@utils/formatCurrency";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBudgetScreen } from "./useBudgetScreen";

export default function BudgetScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const {
    activeBudgets,
    exceededBudgets,
    totalBudget,
    totalSpent,
    baseCurrency,
    hasBudgets,
    handleAddBudget,
    handleEditBudget
  } = useBudgetScreen();

  if (!hasBudgets) {
    return (
      <SafeAreaView
        className="flex-1"
        edges={["top"]}
        style={{ backgroundColor: colors.primary }}
      >
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
          <View
            className="px-6 pt-6 pb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Typography variant="h2" weight="bold" color="#FFFFFF">
              {t("budget.title")}
            </Typography>
            <Typography variant="body" color="#FFFFFF">
              {t("budget.subtitle")}
            </Typography>
          </View>
          <EmptyState
            title={t("budget.noBudgets")}
            description={t("budget.noBudgetsDesc")}
            actionLabel={t("budget.addBudget")}
            onAction={handleAddBudget}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.primary }}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing[8] }}
          style={{ backgroundColor: colors.background }}
        >
          <View
            className="px-6 pt-6 pb-4 mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Typography variant="h2" weight="bold" color="#FFFFFF">
              {t("budget.title")}
            </Typography>
            <Typography variant="body" color="#FFFFFF">
              {t("budget.subtitle")}
            </Typography>
          </View>

          <Card className="mx-4 mb-4">
            <Typography
              variant="caption"
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            >
              {t("budget.totalBudget")}
            </Typography>
            <Typography variant="h3" weight="bold">
              {formatCurrency(totalBudget, baseCurrency)}
            </Typography>
            <View className="flex-row justify-between mt-4">
              <View>
                <Typography variant="caption" color={colors.textSecondary}>
                  {t("budget.spent")}
                </Typography>
                <Typography variant="body" weight="semibold" color="#EF4444">
                  {formatCurrency(totalSpent, baseCurrency)}
                </Typography>
              </View>
              <View className="items-end">
                <Typography variant="caption" color={colors.textSecondary}>
                  {t("budget.remaining")}
                </Typography>
                <Typography variant="body" weight="semibold" color="#10B981">
                  {formatCurrency(totalBudget - totalSpent, baseCurrency)}
                </Typography>
              </View>
            </View>
          </Card>

          {exceededBudgets.length > 0 && (
            <View className="mb-4">
              <Typography
                variant="body"
                weight="semibold"
                color="#EF4444"
                style={{ marginLeft: 20, marginBottom: 8 }}
              >
                {t("budget.exceededBudgets")} ({exceededBudgets.length})
              </Typography>
              {exceededBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  category={budget.category}
                  budgetAmount={budget.amount}
                  spentAmount={budget.spentAmount}
                  currency={baseCurrency}
                  period={budget.period}
                  onPress={() => handleEditBudget(budget.id)}
                />
              ))}
            </View>
          )}

          {activeBudgets.length > 0 && (
            <View>
              <Typography
                variant="body"
                weight="semibold"
                color={colors.textPrimary}
                style={{ marginLeft: 20, marginBottom: 8 }}
              >
                {t("budget.activeBudgets")} ({activeBudgets.length})
              </Typography>
              {activeBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  category={budget.category}
                  budgetAmount={budget.amount}
                  spentAmount={budget.spentAmount}
                  currency={baseCurrency}
                  period={budget.period}
                  onPress={() => handleEditBudget(budget.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
        <FAB onPress={handleAddBudget} />
      </View>
    </SafeAreaView>
  );
}
