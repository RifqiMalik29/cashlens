import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const logger = createLogger("[EmailConfirmation]");

export function useEmailConfirmation() {
  const router = useRouter();
  const { setTokens, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const { queryParams } = Linking.parse(url);

      if (queryParams?.access_token) {
        const accessToken = queryParams.access_token as string;
        const refreshToken = queryParams.refresh_token as string;

        // In the new Go backend flow, we just store the tokens from the magic link
        setTokens(accessToken, refreshToken);
        setAuthenticated(true);

        logger.debug("✓ Session restored via magic link");
        router.replace("/(tabs)");
      }
    };

    // 1. Check initial URL (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // 2. Listen for subsequent URLs (background start)
    const subscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [router, setAuthenticated, setTokens]);
}
