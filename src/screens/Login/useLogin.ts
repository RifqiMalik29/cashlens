import { signInWithEmail } from "@services/supabase";
import { useAuthStore } from "@stores/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLogin() {
  const router = useRouter();
  const { setAuthenticated, setUserId } = useAuthStore();

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
      const { data, error: signInError } = await signInWithEmail(
        email,
        password
      );

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setAuthenticated(true);
      setUserId(data.user?.id ?? null, data.user?.email ?? null);
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
