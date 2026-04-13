import { Button, Card, Typography } from "@components/ui";
import React from "react";
import { View } from "react-native";

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
  const percentage = Math.min(100, Math.round((count / limit) * 100));
  const isNearLimit = percentage >= 80;

  return (
    <View className="px-6 mb-4 gap-4">
      {!isPremium && (
        <Card className={isNearLimit ? "border-warning bg-warning/10" : ""}>
          <View className="flex-row justify-between items-center mb-2">
            <Typography
              variant="body"
              weight="medium"
              color={isNearLimit ? "warning" : "secondary"}
            >
              {count} / {limit} transaksi {currency} bulan ini
            </Typography>
            <Typography
              variant="caption"
              color={isNearLimit ? "warning" : "secondary"}
            >
              {percentage}%
            </Typography>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden w-full mb-3">
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
              Upgrade ke Premium
            </Button>
          )}
        </Card>
      )}

      <Card>
        <Typography variant="h4" weight="bold" className="mb-2">
          Ringkasan Anggaran
        </Typography>
        <Button variant="ghost" size="sm" onPress={onPressBudget}>
          Lihat Detail
        </Button>
      </Card>
    </View>
  );
}
