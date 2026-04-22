import { Button, Card, Typography } from "@components/ui";
import { useColors } from "@hooks/useColors";
import { useBudgetStore } from "@stores/useBudgetStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { BudgetSummary } from "./BudgetSummary";

interface FinancialOverviewProps {
  count: number;
  limit: number;
  currency: string;
  onPressUpgrade: () => void;
  onPressBudget: () => void;
  isPremium?: boolean;
}

export function FinancialOverview({
  count,
  limit,
  currency,
  onPressUpgrade,
  onPressBudget,
  isPremium
}: FinancialOverviewProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const budgets = useBudgetStore((state) => state.budgets);
  const percentage = Math.min(100, Math.round((count / limit) * 100));
  const isNearLimit = percentage >= 80;

  return (
    <View className="px-4 mb-4 gap-4">
      {!isPremium && (
        <Card className={isNearLimit ? "border-warning bg-warning/10" : ""}>
          <View className="flex-row justify-between items-center mb-2">
            <Typography
              variant="body"
              weight="medium"
              color={isNearLimit ? "warning" : "secondary"}
            >
              {t("dashboard.transactionQuotaDesc", { count, limit })}
            </Typography>
            <Typography
              variant="caption"
              color={isNearLimit ? "warning" : "secondary"}
            >
              {percentage}%
            </Typography>
          </View>
          <View
            className="h-2 rounded-full overflow-hidden w-full mb-3"
            style={{ backgroundColor: colors.border }}
          >
            <View
              className={`h-full rounded-full ${isNearLimit ? "bg-warning" : "bg-primary"}`}
              style={{ width: `${percentage}%` }}
            />
          </View>
          {isNearLimit && (
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onPress={onPressUpgrade}
            >
              {t("dashboard.upgradeToUnlimited")}
            </Button>
          )}
        </Card>
      )}

      {budgets.length > 0 && (
        <View>
          <Typography variant="h4" weight="bold" className="mb-2">
            {t("budget.title")}
          </Typography>
          <BudgetSummary currency={currency} onPressBudget={onPressBudget} />
        </View>
      )}
    </View>
  );
}
