import { supabase } from "@services/supabase";
import { useAuthStore } from "@stores/useAuthStore";
import { useNotificationStore } from "@stores/useNotificationStore";
import { logger } from "@utils/logger";
import { useEffect } from "react";

export function useTelegramRealtime() {
  const { userId } = useAuthStore();
  const { setTelegramLinked } = useNotificationStore();

  useEffect(() => {
    if (!userId) return;

    logger.debug(
      "TelegramRealtime",
      `Setting up subscription for user: ${userId}`
    );

    const channel = supabase
      .channel("telegram_links_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_chat_links",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          logger.debug("TelegramRealtime", "Received change:", payload);
          if (payload.eventType === "INSERT") {
            setTelegramLinked(true, payload.new.chat_id.toString());
          } else if (payload.eventType === "DELETE") {
            setTelegramLinked(false);
          }
        }
      )
      .subscribe();

    // Initial check
    const checkStatus = async () => {
      const { data, error } = await supabase
        .from("user_chat_links")
        .select("chat_id")
        .eq("user_id", userId)
        .single();

      if (data && !error) {
        setTelegramLinked(true, data.chat_id.toString());
      } else {
        setTelegramLinked(false);
      }
    };

    checkStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setTelegramLinked]);
}
