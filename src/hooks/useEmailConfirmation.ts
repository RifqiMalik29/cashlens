import { supabase } from "@services/supabase";
import { createLogger } from "@utils/logger";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const logger = createLogger("[EmailConfirmation]");

export function useEmailConfirmation() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);

      if (queryParams?.access_token && queryParams?.type === "signup") {
        const accessToken = queryParams.access_token as string;
        const refreshToken = queryParams.refresh_token as string;

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (!error) {
          logger.debug("✓ Email confirmed successfully");
          router.replace("/(tabs)");
        } else {
          logger.error("✗ Failed to confirm:", error?.message);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);
}
