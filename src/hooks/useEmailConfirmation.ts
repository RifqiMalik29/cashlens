import { useAuthStore } from "@stores/useAuthStore";
import { createLogger } from "@utils/logger";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

const logger = createLogger("[EmailConfirmation]");

export function useEmailConfirmation() {
  const router = useRouter();
  const { setTokens, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleUrl = async (url: string) => {
      logger.debug("Handling URL:", url);

      // Handle magic link with tokens (existing flow)
      if (url.includes("access_token")) {
        const { queryParams } = Linking.parse(url);
        const accessToken = queryParams?.access_token as string;
        const refreshToken = queryParams?.refresh_token as string;

        if (accessToken) {
          setTokens(accessToken, refreshToken);
          setAuthenticated(true);

          logger.debug("✓ Session restored via magic link");
          router.replace("/(tabs)");
        }
        return;
      }

      // Handle email confirmation deep link: cashlens://auth/confirm
      // Backend has already confirmed the email and redirected to this URL
      if (url.includes("auth/confirm")) {
        logger.debug("✓ Email confirmed via deep link");

        // Show success message
        Alert.alert(
          "Success!",
          "Your email has been confirmed. You can now log in to your account.",
          [{ text: "OK" }]
        );

        // Navigate to login screen
        router.push("/(auth)/login");
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
