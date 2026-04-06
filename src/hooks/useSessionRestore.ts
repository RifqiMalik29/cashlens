import { supabase } from "@services/supabase";
import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import { useEffect } from "react";

const logger = createLogger("[SessionRestore]");

export function useSessionRestore() {
  const { setUserId, setAuthenticated, setUserEmail } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session?.user) {
          logger.debug("✓ Restored session for:", session.user.email);
          setUserId(session.user.id, session.user.email);
          setUserEmail(session.user.email ?? null);
          setAuthenticated(true);
        } else {
          logger.debug("⚠ No active session found");
        }
      } catch (error) {
        logger.error("✗ Failed to restore session:", error);
      }
    };

    restoreSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        logger.debug("🔄 Auth state changed:", session.user.email);
        setUserId(session.user.id, session.user.email);
        setUserEmail(session.user.email ?? null);
        setAuthenticated(true);
      } else {
        logger.debug("🔄 User signed out");
        setUserId(null);
        setUserEmail(null);
        setAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUserId, setAuthenticated, setUserEmail]);
}
