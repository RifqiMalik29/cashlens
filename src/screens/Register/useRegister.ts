import { signUpWithEmail } from "@services/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRegister() {
  const router = useRouter();
  const { setAuthenticated, setUserId } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
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

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await signUpWithEmail(
        email,
        password
      );

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user) {
        setAuthenticated(true);
        setUserId(data.user.id, data.user.email);
        router.replace("/(tabs)");
      } else {
        router.push("/(auth)/login");
      }
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
