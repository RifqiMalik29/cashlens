import {
  RecentTransactions,
  SpendingChart,
  SummaryCard
} from "@components/dashboard";
import { EmptyState } from "@components/transaction/EmptyState";
import { Typography } from "@components/ui/Typography";
import { colors, spacing } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDashboardScreen } from "./useDashboardScreen";

export default function DashboardScreen() {
  const {
    summary,
    categorySpending,
    dailySpending,
    recentTransactions,
    baseCurrency,
    categories,
    hasTransactions,
    hasCurrentMonthData
  } = useDashboardScreen();

  useHeader({
    showHeader: false,
    statusBarColor: colors.success
  });

  if (!hasTransactions) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1"
        style={{ backgroundColor: colors.primary }}
      >
        <View className="px-6 pt-6 pb-4">
          <Typography variant="h2" weight="bold" color="#FFFFFF">
            CashLens
          </Typography>
          <Typography variant="body" color="#FFFFFF">
            Kelola keuanganmu dengan cerdas
          </Typography>
        </View>
        <EmptyState
          title="Belum Ada Transaksi"
          description="Mulai catat transaksi keuanganmu untuk melihat ringkasan dan analisis pengeluaran di dashboard."
          customContainerStyle={{ backgroundColor: colors.background }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.primary }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="px-6 pt-6 pb-4 mb-4 bg-background"
          style={{ backgroundColor: colors.primary }}
        >
          <Typography variant="h1" weight="bold" color="#FFFFFF">
            CashLens
          </Typography>
          <Typography variant="body" color="#FFFFFF">
            Kelola keuanganmu dengan cerdas
          </Typography>
        </View>

        <SummaryCard
          balance={summary.balance}
          income={summary.income}
          expense={summary.expense}
          currency={baseCurrency}
        />

        {hasCurrentMonthData && (
          <SpendingChart
            categoryData={categorySpending}
            dailyData={dailySpending}
            currency={baseCurrency}
          />
        )}

        {recentTransactions.length > 0 && (
          <RecentTransactions
            transactions={recentTransactions}
            categories={categories}
            baseCurrency={baseCurrency}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
