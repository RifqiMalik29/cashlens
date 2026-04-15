import { createLogger } from "@utils/logger";
import { useEffect, useState } from "react";

const logger = createLogger("[NetworkStatus]");

interface UseNetworkStatusResult {
  isOnline: boolean;
  checkConnection: () => Promise<boolean>;
}

/**
 * Monitors network connectivity status
 * Uses fetch-based detection to avoid additional dependencies
 */
export function useNetworkStatus(): UseNetworkStatusResult {
  const [isOnline, setIsOnline] = useState(true);

  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch from backend with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/health`,
        {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" }
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        setIsOnline(true);
        return true;
      }

      // Even if health endpoint returns error, network is available
      setIsOnline(true);
      return true;
    } catch (error) {
      const message = (error as Error).message.toLowerCase();
      // Only mark as offline for network-related errors
      if (
        message.includes("network request failed") ||
        message.includes("network is unreachable") ||
        message.includes("offline")
      ) {
        logger.debug("Network connection lost");
        setIsOnline(false);
        return false;
      }

      // Other errors (like 401, 404) mean network is available
      setIsOnline(true);
      return true;
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Periodic checks every 30 seconds
    const intervalId = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    isOnline,
    checkConnection
  };
}
