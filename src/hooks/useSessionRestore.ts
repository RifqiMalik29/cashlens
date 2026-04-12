import { authService } from "@services/api/authService";
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import { useEffect } from "react";

const logger = createLogger("[SessionRestore]");

export function useSessionRestore() {
  const { setUserId, setAuthenticated, setUserEmail, reset } = useAuthStore();

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
  }, [setUserId, setAuthenticated, setUserEmail, reset]);
}
