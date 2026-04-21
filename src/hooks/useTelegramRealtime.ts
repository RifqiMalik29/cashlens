import { authService } from "@services/authService";
import { useAuthStore } from "@stores/useAuthStore";
import { useNotificationStore } from "@stores/useNotificationStore";
import { logger } from "@utils/logger";
import { useEffect } from "react";

// One-time check on app start. Polling removed — Telegram link status
// is checked on demand when the user opens Notification Settings.
export function useTelegramRealtime() {
  const { userId, isAuthenticated } = useAuthStore();
  const { setTelegramLinked } = useNotificationStore();

  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    logger.debug("TelegramRealtime", `Checking status for user: ${userId}`);

    const checkStatus = async () => {
      try {
        const status = await authService.getTelegramStatus();
        if (status.is_linked && status.chat_id) {
          setTelegramLinked(true, String(status.chat_id));
        } else {
          setTelegramLinked(false);
        }
      } catch (error) {
        const msg = (error as Error).message;
        if (!msg.includes("404")) {
          logger.error(
            "TelegramRealtime",
            "Error checking status:",
            error as Error
          );
        }
        setTelegramLinked(false);
      }
    };

    checkStatus();
    // No interval — status is re-checked when user opens Notification Settings
  }, [userId, isAuthenticated, setTelegramLinked]);
}
