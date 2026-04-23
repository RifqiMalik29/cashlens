import {
  DashboardHeader,
  FinancialOverview,
  RecentTransactions,
  SpendingChart,
  SummaryCard
} from "@components/dashboard";
import { EmptyState } from "@components/transaction/EmptyState";
import { BaseDialog } from "@components/ui";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { notificationService } from "@services/notificationService";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View
} from "react-native";
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
    handleRefresh,
    transactionCount,
    transactionLimit,
    isPremium,
    isInitialPull,
    lastSyncedAt,
    getRelativeTime
  } = useDashboardScreen();

  const router = useProtectedRouter();
  const colors = useColors();

  useHeader({
    showHeader: false,
    statusBarColor: colors.success
  });

  // Show loading indicator during initial data pull
  if (isInitialPull) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.success} />
      </SafeAreaView>
    );
  }

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
          lastSyncedAt={lastSyncedAt}
          getRelativeTime={getRelativeTime}
        />
        <EmptyState
          title={t("dashboard.noTransactions")}
          description={t("dashboard.noTransactionsDesc")}
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
          onPressBell={() => router.push("/drafts")}
          lastSyncedAt={lastSyncedAt}
          getRelativeTime={getRelativeTime}
        />

        <View style={{ marginTop: -40 }}>
          <SummaryCard
            balance={summary.balance}
            income={summary.income}
            expense={summary.expense}
            currency={baseCurrency}
          />
        </View>

        <FinancialOverview
          count={transactionCount}
          limit={transactionLimit}
          currency={baseCurrency}
          onPressUpgrade={() => router.push("/upgrade" as never)}
          onPressBudget={() => router.replace("/(tabs)/budget")}
          isPremium={isPremium}
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
