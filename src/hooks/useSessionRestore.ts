import { authService } from "@services/api/authService";
import i18n, { normalizeLanguage } from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import { useEffect } from "react";

const logger = createLogger("[SessionRestore]");

// Network-related errors that should NOT reset the session
const NETWORK_ERROR_PATTERNS = [
  "network",
  "fetch",
  "connection",
  "timeout",
  "abort",
  "offline"
];

function isNetworkError(error: unknown): boolean {
  const message = (error as Error).message.toLowerCase();
  return NETWORK_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

export function useSessionRestore() {
  const {
    setUserId,
    setAuthenticated,
    setUserEmail,
    updatePreferences
  } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      const { accessToken, isAuthenticated } = useAuthStore.getState();
      
      // Don't attempt restore if user is not authenticated
      // (they're likely on the login screen)
      if (!isAuthenticated) {
        logger.debug("⚠ User not authenticated, skipping restore");
        return;
      }

      // Don't attempt restore if no access token
      if (!accessToken) {
        logger.debug("⚠ No active session found (missing token)");
        return;
      }

      try {
        const user = await authService.getMe();

        if (user) {
          logger.debug("✓ Restored session for:", user.email);
          setUserId(user.id, user.email);
          setUserEmail(user.email);

          // Sync language from backend (source of truth)
          const backendLang = user.preferences?.language;
          if (backendLang && normalizeLanguage(backendLang) === backendLang) {
            const currentLang = useAuthStore.getState().preferences.language;
            if (backendLang !== currentLang) {
              logger.debug(" Syncing language from backend:", backendLang);
              updatePreferences({ language: backendLang });
              i18n.changeLanguage(backendLang);
            }
          }

          setAuthenticated(true);
        } else {
          logger.debug("⚠ Session invalid, resetting...");
          useAuthStore.getState().reset();
        }
      } catch (error) {
        // Don't reset session on network errors - user stays logged in
        // with cached data. Session will be validated when network returns.
        if (isNetworkError(error)) {
          logger.debug("⚠ Network error during session restore, keeping cached session");
          return;
        }

        // Only reset on actual auth errors (401, invalid token, etc.)
        const message = (error as Error).message.toLowerCase();
        if (message.includes("unauthorized") || message.includes("401")) {
          logger.debug("⚠ Session invalid, resetting...");
          useAuthStore.getState().reset();
        } else {
          logger.error("✗ Unexpected error during session restore:", error);
        }
      }
    };

    restoreSession();
  }, [setUserId, setAuthenticated, setUserEmail, updatePreferences]);
}
