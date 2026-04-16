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
  const { tier: subscriptionTier, quota } = useSubscriptionStore();

  const actualTransactionLimit =
    quota.transactionsLimit ?? FREE_TRANSACTION_LIMIT;
  const actualScanLimit = quota.scansLimit ?? FREE_SCAN_LIMIT;

  const [scanQuota, setScanQuota] = useState<ScanQuota>({
    count: 0,
    month: getCurrentMonth()
  });
  const [isScanQuotaLoading, setIsScanQuotaLoading] = useState(true);

  const currentMonth = getCurrentMonth();

  // 1. Calculate Transaction Quota (Monthly)
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Use createdAt to count how many transactions were ADDED this month
      // rather than the effective transaction date
      const createDate = new Date(t.createdAt || t.date);
      const createMonth = `${createDate.getFullYear()}-${String(
        createDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return createMonth === currentMonth;
    });
  }, [transactions, currentMonth]);

  const transactionCount = currentMonthTransactions.length;
  // Use the backend quota count if local count is lower, otherwise local count
  const effectiveTransactionCount = Math.max(
    transactionCount,
    quota.transactionsUsed
  );
  const isTransactionLimitReached =
    subscriptionTier === "free" &&
    effectiveTransactionCount >= actualTransactionLimit;

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

  // Use backend scan usage if local count is lower
  const scanCount = Math.max(scanQuota.count, quota.scansUsed);
  const isScanLimitReached =
    subscriptionTier === "free" && scanCount >= actualScanLimit;

  // Magic Scans logic: If free and hasn't used up 5 magic scans yet
  const hasMagicScansRemaining =
    subscriptionTier === "free" && stealthScansUsed < MAGIC_SCAN_LIMIT;

  const recordScan = useCallback(async () => {
    if (subscriptionTier === "premium") return;

    // Increment stealth scans if still in trial
    if (hasMagicScansRemaining) {
      incrementStealthScans();
    }

    // Always record against the monthly limit too
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
    // Transaction Quota
    transactionCount: effectiveTransactionCount,
    transactionLimit: actualTransactionLimit,
    isTransactionLimitReached,
    canAddTransaction:
      subscriptionTier === "premium" || !isTransactionLimitReached,

    // Scan Quota
    scanCount,
    scanLimit: actualScanLimit,
    isScanLimitReached,
    hasMagicScansRemaining,
    stealthScansUsed,
    isQuotaLoading: isScanQuotaLoading,
    recordScan,

    // Tier info
    isPremium: subscriptionTier === "premium"
  };
}
