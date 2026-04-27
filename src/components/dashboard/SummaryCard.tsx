import { useColors } from "@hooks/useColors";
import { useQuota } from "@hooks/useQuota";
import { formatCurrency } from "@utils/formatCurrency";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface SummaryCardProps {
  balance: number;
  income: number;
  expense: number;
  currency: string;
}

export function SummaryCard({
  balance,
  income,
  expense,
  currency
}: SummaryCardProps) {
  const { t } = useTranslation();
  const { isPremium } = useQuota();
  const colors = useColors();

  return (
    <Card className="mx-4 mb-4" style={{ shadowOpacity: 0.08 }}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            weight="medium"
          >
            {t("dashboard.totalBalance")}
          </Typography>
          <Typography variant="h2" weight="bold" style={{ marginTop: 4 }}>
            {formatCurrency(balance, currency)}
          </Typography>
        </View>
        {isPremium && <Badge label={t("settings.premium")} variant="success" />}
      </View>

      <View className="flex-row gap-4 mb-6">
        <View className="flex-1">
          <View className="flex-row items-center gap-1 mb-1">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Typography variant="caption" color={colors.textSecondary}>
              {t("dashboard.income")}
            </Typography>
          </View>
          <Typography variant="body" weight="semibold" color="#10B981">
            +{formatCurrency(income, currency)}
          </Typography>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1 mb-1">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Typography variant="caption" color={colors.textSecondary}>
              {t("dashboard.expense")}
            </Typography>
          </View>
          <Typography variant="body" weight="semibold" color="#EF4444">
            -{formatCurrency(expense, currency)}
          </Typography>
        </View>
      </View>
    </Card>
  );
}
