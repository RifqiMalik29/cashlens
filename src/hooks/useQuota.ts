import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@stores/useAuthStore";
import { useSubscriptionStore } from "@stores/useSubscriptionStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { createLogger } from "@utils/logger";
import { useCallback, useEffect, useMemo, useState } from "react";

const logger = createLogger("[Quota]");

const SCAN_QUOTA_STORAGE_KEY = "scan-quota";
export const FREE_TRANSACTION_LIMIT = 50;
export const FREE_SCAN_LIMIT = 5;
export const MAGIC_SCAN_LIMIT = 5;

interface ScanQuota {
  count: number;
  month: string; // "YYYY-MM" format
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export function useQuota() {
  const { stealthScansUsed, incrementStealthScans } = useAuthStore();
  const { transactions } = useTransactionStore();
  const { tier: subscriptionTier } = useSubscriptionStore();

  const [scanQuota, setScanQuota] = useState<ScanQuota>({
    count: 0,
    month: getCurrentMonth()
  });
  const [isScanQuotaLoading, setIsScanQuotaLoading] = useState(true);

  const currentMonth = getCurrentMonth();

  // 1. Calculate Transaction Quota (Monthly)
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const createDate = new Date(t.createdAt || t.date);
      const createMonth = `${createDate.getFullYear()}-${String(
        createDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return createMonth === currentMonth;
    });
  }, [transactions, currentMonth]);

  const transactionCount = currentMonthTransactions.length;
  const isTransactionLimitReached =
    subscriptionTier === "free" &&
    transactionCount >= FREE_TRANSACTION_LIMIT;

  // 2. Load and Manage Scan Quota
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SCAN_QUOTA_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ScanQuota;
          if (parsed.month !== currentMonth) {
            const fresh = { count: 0, month: currentMonth };
            await AsyncStorage.setItem(
              SCAN_QUOTA_STORAGE_KEY,
              JSON.stringify(fresh)
            );
            setScanQuota(fresh);
          } else {
            setScanQuota(parsed);
          }
        } else {
          const initial = { count: 0, month: currentMonth };
          await AsyncStorage.setItem(
            SCAN_QUOTA_STORAGE_KEY,
            JSON.stringify(initial)
          );
          setScanQuota(initial);
        }
      } catch (e) {
        logger.error("Failed to load scan quota:", e);
      } finally {
        setIsScanQuotaLoading(false);
      }
    })();
  }, [currentMonth]);

  const isScanLimitReached =
    subscriptionTier === "free" && scanQuota.count >= FREE_SCAN_LIMIT;

  const hasMagicScansRemaining =
    subscriptionTier === "free" && stealthScansUsed < MAGIC_SCAN_LIMIT;

  const recordScan = useCallback(async () => {
    if (subscriptionTier === "premium") return;

    if (hasMagicScansRemaining) {
      incrementStealthScans();
    }

    const next = { count: scanQuota.count + 1, month: currentMonth };
    setScanQuota(next);
    try {
      await AsyncStorage.setItem(SCAN_QUOTA_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      logger.error("Failed to save scan quota:", e);
    }
  }, [
    subscriptionTier,
    hasMagicScansRemaining,
    incrementStealthScans,
    scanQuota.count,
    currentMonth
  ]);

  return {
    transactionCount,
    transactionLimit: FREE_TRANSACTION_LIMIT,
    isTransactionLimitReached,
    canAddTransaction:
      subscriptionTier === "premium" || !isTransactionLimitReached,

    scanCount: scanQuota.count,
    scanLimit: FREE_SCAN_LIMIT,
    isScanLimitReached,
    hasMagicScansRemaining,
    stealthScansUsed,
    isQuotaLoading: isScanQuotaLoading,
    recordScan,

    isPremium: subscriptionTier === "premium"
  };
}
