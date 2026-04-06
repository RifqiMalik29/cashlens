import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "@utils/logger";
import { useCallback, useEffect, useState } from "react";

const logger = createLogger("[ScanQuota]");

const QUOTA_STORAGE_KEY = "scan-quota";
const FREE_TIER_LIMIT = 5;

interface ScanQuota {
  count: number;
  month: string; // "YYYY-MM" format
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export function useScanQuota() {
  const [quota, setQuota] = useState<ScanQuota>({
    count: 0,
    month: getCurrentMonth()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(QUOTA_STORAGE_KEY);
        const currentMonth = getCurrentMonth();

        if (stored) {
          const parsed = JSON.parse(stored) as ScanQuota;
          // Reset count if we're in a new month
          if (parsed.month !== currentMonth) {
            const fresh = { count: 0, month: currentMonth };
            await AsyncStorage.setItem(
              QUOTA_STORAGE_KEY,
              JSON.stringify(fresh)
            );
            setQuota(fresh);
          } else {
            setQuota(parsed);
          }
        } else {
          const initial = { count: 0, month: currentMonth };
          await AsyncStorage.setItem(
            QUOTA_STORAGE_KEY,
            JSON.stringify(initial)
          );
          setQuota(initial);
        }
      } catch (e) {
        logger.error("Failed to load scan quota:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const remaining = Math.max(0, FREE_TIER_LIMIT - quota.count);
  const isLimitReached = remaining <= 0;

  const recordScan = useCallback(async () => {
    const currentMonth = getCurrentMonth();
    const next = { count: quota.count + 1, month: currentMonth };
    setQuota(next);
    try {
      await AsyncStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      logger.error("Failed to save scan quota:", e);
    }
  }, [quota.count]);

  return {
    remaining,
    limit: FREE_TIER_LIMIT,
    isLimitReached,
    isLoading,
    recordScan
  };
}
