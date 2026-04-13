import { authService } from "@services/api/authService";
import i18n, { normalizeLanguage } from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import { useEffect } from "react";

const logger = createLogger("[SessionRestore]");

export function useSessionRestore() {
  const {
    setUserId,
    setAuthenticated,
    setUserEmail,
    updatePreferences,
    reset
  } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      const { accessToken } = useAuthStore.getState();
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
          reset();
        }
      } catch (error) {
        logger.error("✗ Failed to restore session:", error);
        reset();
      }
    };

    restoreSession();
  }, [setUserId, setAuthenticated, setUserEmail, updatePreferences, reset]);
}
