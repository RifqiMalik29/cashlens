/* eslint-disable no-console */
import { useEffect } from "react";

import { supabase } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export function useSessionRestore() {
  const { setUserId, setAuthenticated, setUserEmail } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log(
            "[SessionRestore] ✓ Restored session for:",
            session.user.email
          );
          setUserId(session.user.id, session.user.email);
          setUserEmail(session.user.email ?? null);
          setAuthenticated(true);
        } else {
          console.log("[SessionRestore] ⚠ No active session found");
        }
      } catch (error) {
        console.error("[SessionRestore] ✗ Failed to restore session:", error);
      }
    };

    restoreSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log(
          "[SessionRestore] 🔄 Auth state changed:",
          session.user.email
        );
        setUserId(session.user.id, session.user.email);
        setUserEmail(session.user.email ?? null);
        setAuthenticated(true);
      } else {
        console.log("[SessionRestore] 🔄 User signed out");
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
