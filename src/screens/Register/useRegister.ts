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

export function useRegister() {
  const router = useRouter();
  const { setAuthenticated, setUserId, setTokens, updatePreferences, reset } =
    useAuthStore();
  const resetSyncStatus = useSyncStore((state) => state.reset);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Nama harus diisi");
      return;
    }

    if (!email.trim()) {
      setError("Email harus diisi");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.register(email, password, name);

      // Clear all stores to prevent data leakage from previous users
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

  const handleGoToLogin = () => {
    router.back();
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    showPassword,
    showConfirmPassword,
    handleRegister,
    handleGoToLogin,
    toggleShowPassword,
    toggleShowConfirmPassword
  };
}
