/* eslint-disable no-console */
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import { supabase } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export function useEmailConfirmation() {
  const router = useRouter();
  const { setUserId, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);

      if (queryParams?.access_token && queryParams?.type === "signup") {
        const accessToken = queryParams.access_token as string;
        const refreshToken = queryParams.refresh_token as string;

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (!error && data.user) {
          console.log("[EmailConfirmation] ✓ Email confirmed successfully");
          setUserId(data.user.id);
          setAuthenticated(true);
          router.replace("/(tabs)");
        } else {
          console.error(
            "[EmailConfirmation] ✗ Failed to confirm:",
            error?.message
          );
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    const syncUserFromSession = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setAuthenticated(true);
      }
    };

    syncUserFromSession();

    return () => {
      subscription.remove();
    };
  }, [router, setUserId, setAuthenticated]);
}
