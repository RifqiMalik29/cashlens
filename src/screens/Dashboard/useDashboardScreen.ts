import { useCloudSync } from "@hooks/useCloudSync";
import { useNotificationSubscription } from "@hooks/useNotificationSubscription";
import { useQuota } from "@hooks/useQuota";
import { useSyncStatus } from "@hooks/useSyncStatus";
import { notificationService } from "@services/notificationService";
import { useAuthStore } from "@stores/useAuthStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useDraftStore } from "@stores/useDraftStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { logger } from "@utils/logger";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PermissionsAndroid, Platform } from "react-native";

type CategorySpending = {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
};

export function useDashboardScreen() {
  const { t } = useTranslation();
  const { baseCurrency } = useAuthStore((state) => state.preferences);
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);
  const { drafts } = useDraftStore();
  const { isInitialPull } = useSyncStatus();
  const [isPermissionDialogVisible, setIsPermissionDialogVisible] =
    useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { pullData } = useCloudSync();

  // Subscribe to notifications
  useNotificationSubscription();

  const { transactionCount, transactionLimit, isPremium } = useQuota();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await pullData();
    setIsRefreshing(false);
  }, [pullData]);

  const pendingCount = useMemo(
    () => drafts.filter((d) => d.status === "pending").length,
    [drafts]
  );

  const handleTestNotification = async () => {
    if (!__DEV__) return;

    if (Platform.OS === "android" && Platform.Version >= 33) {
      const hasPostNotif = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (!hasPostNotif) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      }
    }

    const granted = await notificationService.isPermissionGranted();
    if (!granted) {
      setIsPermissionDialogVisible(true);
      return;
    }

    logger.debug("Dashboard", t("notifications.testSent"));
    notificationService.sendTestNotification(
      "BCA Mobile",
      "Transfer Rp 150.000 ke TOKOPEDIA BERHASIL",
      "com.bca.mobile"
    );
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });
  }, [transactions, currentMonth, currentYear]);

  const summary = useMemo(() => {
    const allTimeIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amountInBaseCurrency, 0);
    const allTimeExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amountInBaseCurrency, 0);
    return {
      balance: allTimeIncome - allTimeExpense,
      income: allTimeIncome,
      expense: allTimeExpense
    };
  }, [transactions]);

  const categorySpending = useMemo<CategorySpending[]>(() => {
    const expenseByCategory = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amountInBaseCurrency;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(expenseByCategory)
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || "Lainnya",
          color: category?.color || "#9CA3AF",
          amount
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions, categories]);

  const dailySpending = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyData: Record<string, number> = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      dailyData[dateStr] = 0;
    }

    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const dateStr = t.date.split("T")[0];
        if (dailyData[dateStr] !== undefined) {
          dailyData[dateStr] += t.amountInBaseCurrency;
        }
      });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days
      .filter((dateStr) => dailyData[dateStr] !== undefined)
      .map((dateStr) => ({
        date: dateStr,
        day: new Date(dateStr).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "numeric"
        }),
        amount: dailyData[dateStr] || 0
      }));
  }, [currentMonthTransactions, currentMonth, currentYear]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions]
  );

  return {
    t,
    summary,
    categorySpending,
    dailySpending,
    recentTransactions,
    baseCurrency,
    categories,
    hasTransactions: transactions.length > 0,
    hasCurrentMonthData: currentMonthTransactions.length > 0,
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
    transactions
  };
}
