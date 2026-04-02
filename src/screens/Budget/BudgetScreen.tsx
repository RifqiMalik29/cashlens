import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BudgetCard } from "@/components/budget/BudgetCard";
import { EmptyState } from "@/components/transaction/EmptyState";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";
import { formatCurrency } from "@/utils/formatCurrency";

import { useBudgetScreen } from "./useBudgetScreen";

export default function BudgetScreen() {
  const router = useRouter();
  const {
    activeBudgets,
    exceededBudgets,
    totalBudget,
    totalSpent,
    baseCurrency,
    hasBudgets
  } = useBudgetScreen();

  const handleAddBudget = () => {
    router.push("/(tabs)/budget/add");
  };

  const handleEditBudget = (budgetId: string) => {
    router.push(`/(tabs)/budget/edit?id=${budgetId}`);
  };

  if (!hasBudgets) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 pt-6 pb-4">
          <Typography variant="h2" weight="bold">
            Anggaran
          </Typography>
          <Typography variant="body" color="#6B7280">
            Kelola batas pengeluaran per kategori
          </Typography>
        </View>
        <EmptyState
          title="Belum Ada Anggaran"
          description="Buat anggaran untuk membatasi pengeluaran per kategori dan track progresnya."
          actionLabel="Tambah Anggaran"
          onAction={handleAddBudget}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing[8] }}
      >
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography variant="h2" weight="bold">
                Anggaran
              </Typography>
              <Typography variant="body" color="#6B7280">
                Kelola batas pengeluaran per kategori
              </Typography>
            </View>
            <TouchableOpacity
              onPress={handleAddBudget}
              className="bg-primary-light px-4 py-2 rounded-lg"
            >
              <Typography variant="body" weight="semibold" color="#4CAF82">
                + Baru
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <Card className="mx-4 mb-4">
          <Typography
            variant="caption"
            color="#6B7280"
            style={{ marginBottom: 8 }}
          >
            Total Anggaran
          </Typography>
          <Typography variant="h3" weight="bold">
            {formatCurrency(totalBudget, baseCurrency)}
          </Typography>
          <View className="flex-row justify-between mt-4">
            <View>
              <Typography variant="caption" color="#6B7280">
                Terpakai
              </Typography>
              <Typography variant="body" weight="semibold" color="#EF4444">
                {formatCurrency(totalSpent, baseCurrency)}
              </Typography>
            </View>
            <View className="items-end">
              <Typography variant="caption" color="#6B7280">
                Sisa
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
              Melebihi Anggaran ({exceededBudgets.length})
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
              color="#1A1A2E"
              style={{ marginLeft: 20, marginBottom: 8 }}
            >
              Anggaran Aktif ({activeBudgets.length})
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
    </SafeAreaView>
  );
}
