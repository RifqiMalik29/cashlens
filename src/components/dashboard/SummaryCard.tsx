import { useQuota } from "@hooks/useQuota";
import { formatCurrency } from "@utils/formatCurrency";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { ProgressBar } from "../budget/ProgressBar";
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
  const { transactionCount, transactionLimit, isPremium } = useQuota();

  const quotaProgress = Math.min(
    (transactionCount / transactionLimit) * 100,
    100
  );

  return (
    <Card className="mx-4 mb-4" style={{ shadowOpacity: 0.08 }}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Typography variant="caption" color="#6B7280" weight="medium">
            {t("dashboard.totalBalance")}
          </Typography>
          <Typography variant="h2" weight="bold" style={{ marginTop: 4 }}>
            {formatCurrency(balance, currency)}
          </Typography>
        </View>
        {isPremium && <Badge label="Premium" variant="success" />}
      </View>

      <View className="flex-row gap-4 mb-6">
        <View className="flex-1">
          <View className="flex-row items-center gap-1 mb-1">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Typography variant="caption" color="#6B7280">
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
            <Typography variant="caption" color="#6B7280">
              {t("dashboard.expense")}
            </Typography>
          </View>
          <Typography variant="body" weight="semibold" color="#EF4444">
            -{formatCurrency(expense, currency)}
          </Typography>
        </View>
      </View>

      {!isPremium && (
        <View className="pt-4 border-t border-gray-100">
          <View className="flex-row justify-between items-center mb-2">
            <Typography variant="caption" color="#6B7280" weight="medium">
              {t("dashboard.transactionQuota")}
            </Typography>
            <Typography variant="caption" color="#374151" weight="semibold">
              {t("dashboard.transactionQuotaDesc", {
                count: transactionCount,
                limit: transactionLimit
              })}
            </Typography>
          </View>
          <ProgressBar progress={quotaProgress} />
          {quotaProgress >= 80 && (
            <TouchableOpacity className="mt-2 items-end">
              <Typography
                variant="caption"
                color="#6366F1"
                weight="bold"
                style={{ fontSize: 11 }}
              >
                {t("dashboard.upgradeToUnlimited")} →
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Card>
  );
}
