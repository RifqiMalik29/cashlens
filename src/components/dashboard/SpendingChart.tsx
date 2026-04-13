import { spacing } from "@constants/theme";
import { formatCompactCurrency } from "@utils/formatCurrency";
import { useMemo } from "react";
import { View } from "react-native";

import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";

interface CategorySpending {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
}

interface DailySpending {
  day: string;
  amount: number;
}

interface SpendingChartProps {
  categoryData: CategorySpending[];
  dailyData: DailySpending[];
  currency: string;
}

export function SpendingChart({
  categoryData,
  dailyData,
  currency
}: SpendingChartProps) {
  const totalExpense = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.amount, 0);
  }, [categoryData]);

  if (categoryData.length === 0) {
    return (
      <>
        <Typography variant="h4" weight="semibold" className="mx-4 mb-4">
          Pengeluaran Bulan Ini
        </Typography>
        <Card className="mx-4 mb-4">
          <View className="items-center justify-center py-8">
            <Typography
              variant="body"
              color="#6B7280"
              style={{ textAlign: "center" }}
            >
              Belum ada data pengeluaran untuk bulan ini
            </Typography>
          </View>
        </Card>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" weight="semibold" className="mx-4 mb-4">
        Pengeluaran Bulan Ini
      </Typography>
      <Card className="mx-4 mb-4">
        <View className="mb-6">
          <Typography
            variant="caption"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Berdasarkan Kategori
          </Typography>
          <View className="gap-3">
            {categoryData.map((item) => {
              const percentage =
                totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
              return (
                <View key={item.categoryId}>
                  <View className="flex-row justify-between mb-1">
                    <Typography
                      variant="caption"
                      weight="medium"
                      color="#1A1A2E"
                    >
                      {item.categoryName}
                    </Typography>
                    <Typography
                      variant="caption"
                      weight="semibold"
                      color="#6B7280"
                    >
                      {formatCompactCurrency(item.amount, currency)}
                    </Typography>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View>
          <Typography
            variant="caption"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Tren Harian (7 Hari Terakhir)
          </Typography>
          <View className="items-center">
            {dailyData.map((day, index) => {
              const maxAmount = Math.max(...dailyData.map((d) => d.amount));
              const barWidth =
                maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;

              return (
                <View
                  key={index}
                  className="flex-row items-center mb-2 w-full px-4"
                >
                  <Typography
                    variant="caption"
                    color="#6B7280"
                    style={{ width: 50 }}
                  >
                    {day.day}
                  </Typography>
                  <View className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </View>
                  <Typography
                    variant="caption"
                    weight="semibold"
                    color="#4CAF82"
                    style={{ width: 60, textAlign: "right" }}
                  >
                    {formatCompactCurrency(day.amount, currency)}
                  </Typography>
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    </>
  );
}
