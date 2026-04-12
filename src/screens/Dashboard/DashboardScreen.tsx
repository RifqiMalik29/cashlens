import {
  BudgetSummary,
  DashboardHeader,
  RecentTransactions,
  SpendingChart,
  SummaryCard
} from "@components/dashboard";
import { EmptyState } from "@components/transaction/EmptyState";
import { BaseDialog } from "@components/ui/BaseDialog";
import { colors, spacing } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { notificationService } from "@services/notificationService";
import { useRouter } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDashboardScreen } from "./useDashboardScreen";

export default function DashboardScreen() {
  const {
    t,
    summary,
    categorySpending,
    dailySpending,
    recentTransactions,
    baseCurrency,
    categories,
    hasTransactions,
    hasCurrentMonthData,
    isPermissionDialogVisible,
    setIsPermissionDialogVisible,
    pendingCount,
    handleTestNotification,
    isRefreshing,
    handleRefresh
  } = useDashboardScreen();

  const router = useRouter();

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
        <DashboardHeader
          pendingCount={pendingCount}
          handleTestNotification={handleTestNotification}
          onPressBell={() => router.push("/drafts")}
        />
        <EmptyState
          title={t("dashboard.noTransactions")}
          description={t("dashboard.noTransactionsDesc")}
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
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <DashboardHeader
          pendingCount={pendingCount}
          handleTestNotification={handleTestNotification}
          onPressBell={() => router.push("/drafts")}
        />

        <View style={{ marginTop: -40 }}>
          <SummaryCard
            balance={summary.balance}
            income={summary.income}
            expense={summary.expense}
            currency={baseCurrency}
          />
        </View>

        <BudgetSummary
          currency={baseCurrency}
          onPressBudget={() => router.replace("/(tabs)/budget")}
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

      <BaseDialog
        isVisible={isPermissionDialogVisible}
        title={t("notifications.permissionTitle")}
        message={t("notifications.permissionDesc")}
        type="warning"
        primaryButtonText={t("notifications.permissionWarning")}
        onPrimaryButtonPress={() => {
          setIsPermissionDialogVisible(false);
          notificationService.openNotificationSettings();
        }}
        secondaryButtonText={t("notifications.later")}
        onSecondaryButtonPress={() => setIsPermissionDialogVisible(false)}
        onClose={() => setIsPermissionDialogVisible(false)}
      />
    </SafeAreaView>
  );
}
