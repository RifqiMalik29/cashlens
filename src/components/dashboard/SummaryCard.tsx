import { formatCurrency } from "@utils/formatCurrency";
import { View } from "react-native";

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
  return (
    <Card className="mx-4 mb-4" style={{ shadowOpacity: 0.08 }}>
      <View className="mb-4">
        <Typography variant="caption" color="#6B7280" weight="medium">
          Saldo Total
        </Typography>
        <Typography variant="h2" weight="bold" style={{ marginTop: 4 }}>
          {formatCurrency(balance, currency)}
        </Typography>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-1 mb-1">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Typography variant="caption" color="#6B7280">
              Pemasukan
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
              Pengeluaran
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
