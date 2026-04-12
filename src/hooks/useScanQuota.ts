import { useQuota } from "./useQuota";

/**
 * @deprecated Use useQuota instead.
 * This remains for backward compatibility during transition.
 */
export function useScanQuota() {
  const {
    scanCount,
    scanLimit,
    isScanLimitReached,
    isQuotaLoading,
    recordScan
  } = useQuota();

  return {
    remaining: Math.max(0, scanLimit - scanCount),
    limit: scanLimit,
    isLimitReached: isScanLimitReached,
    isLoading: isQuotaLoading,
    recordScan
  };
}
