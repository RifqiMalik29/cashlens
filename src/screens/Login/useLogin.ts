import { authService } from "@services/api/authService";
import i18n, { normalizeLanguage } from "@services/i18n";
import { useAuthStore } from "@stores/useAuthStore";
import { useBudgetStore } from "@stores/useBudgetStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSyncStore } from "@stores/useSyncStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { useRouter } from "expo-router";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLogin() {
  const router = useRouter();
  const { setAuthenticated, setUserId, setTokens, updatePreferences, reset } =
    useAuthStore();
  const resetSyncStatus = useSyncStore((state) => state.reset);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Email harus diisi");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(email, password);

      // Clear all stores before setting new user to prevent data leakage
      reset();
      useTransactionStore.getState().clearTransactions();
      useBudgetStore.getState().clearBudgets();
      useCategoryStore.getState().resetToDefault();
      resetSyncStatus();

      const accessToken =
        data.access_token ||
        (data as unknown as Record<string, string>).accessToken ||
        (data as unknown as Record<string, string>).token;
      const refreshToken =
        data.refresh_token ||
        (data as unknown as Record<string, string>).refreshToken;

      setTokens(accessToken, refreshToken);
      setUserId(data.user.id, data.user.email);

      // Save language preference from backend, fallback to current i18n language
      const backendLang = data.user.preferences?.language;
      if (backendLang && normalizeLanguage(backendLang) === backendLang) {
        updatePreferences({ language: backendLang });
        i18n.changeLanguage(backendLang);
      }

      setAuthenticated(true);

      router.replace("/(tabs)");
    } catch (err) {
      setError((err as Error).message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push("/(auth)/register");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showPassword,
    handleLogin,
    handleGoToRegister,
    toggleShowPassword
  };
}
