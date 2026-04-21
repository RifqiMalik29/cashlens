import {
  GoogleSignin,
  isSuccessResponse
} from "@react-native-google-signin/google-signin";
import { authService } from "@services/authService";
import i18n, { normalizeLanguage } from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSyncStore } from "@stores/useSyncStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useEffect, useState } from "react";

import { useProtectedRouter } from "./useProtectedRouter";

const WEB_CLIENT_ID =
  "552315397645-eo82ht4qr87pqplh5g08nfhe7319kf3u.apps.googleusercontent.com";

export function useGoogleSignIn() {
  const router = useProtectedRouter();
  const { setAuthenticated, setUserId, setTokens, updatePreferences, reset } =
    useAuthStore();
  const resetSyncStatus = useSyncStore((state) => state.reset);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return;
      }

      const idToken = response.data.idToken;

      if (!idToken) {
        setError("Google sign-in failed: no ID token");
        return;
      }

      const data = await authService.loginWithGoogle(idToken);

      await reset();
      useTransactionStore.getState().clearTransactions();
      useBudgetStore.getState().clearBudgets();
      useCategoryStore.getState().resetToDefault();
      resetSyncStatus();

      setTokens(data.access_token, data.refresh_token);
      setUserId(data.user.id, data.user.email);

      const backendLang = data.user.language;
      if (backendLang && normalizeLanguage(backendLang) === backendLang) {
        updatePreferences({ language: backendLang });
        i18n.changeLanguage(backendLang);
      }

      if (data.user.base_currency) {
        updatePreferences({ baseCurrency: data.user.base_currency });
      }

      setAuthenticated(true);
      router.replace("/(tabs)");
    } catch (err) {
      setError((err as Error).message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGoogleSignIn, isLoading, error };
}
